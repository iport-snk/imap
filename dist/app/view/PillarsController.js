Ext.define('IM.view.PillarsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pillars',
    selectedPillar: {},

    data: {},

    init: function () {
        this.mapContainer = Ext.ComponentQuery.query('Map')[0];
        this.loadMapObjects("2");
        this.loadMapObjects("3");

    },

    loadMapObjects: function (type) {
        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapObjects',
            type: type
        }).done((data) => {
            this.data[type] = data;
        })
    },

    onRegionChange: function (record) {
        let regionId = record.get('id');

        this.bindTp(regionId, record.get('pos'));
        this.lookup('region').setValue(regionId);
    },


    getObjectManager: function () {
        // Оптимальное добавление множества меток
        // https://tech.yandex.ru/maps/jsbox/2.1/object_manager
    },

    loadPillars: function (regionId) {
        ymaps.geoQuery(IM.provider.Map.ymap.geoObjects)
            .search('properties.type=="regionPillar"')
            .removeFromMap(IM.provider.Map.ymap);

        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapPillars',
            region: regionId
        }).done((items) => {
            items.forEach((data) => {
                var position = data.pos.split(" ");

                this.createPillar(position, {
                    rowId: data.id,
                    tp: data.tp,
                    line: data.line,
                    region: data.region,
                    box: data.box,
                    description: data.description,
                    iconContent: data.name
                }, {
                    preset: 'islands#violetCircleIcon'
                });
            })

        });
    },

    bindTp: function(regionId, pos) {
        //ymaps.geoQuery(IM.provider.Map.ymap.geoObjects).each((o) => console.log(o.properties.get('region')))

        let tp = this.lookup('tpCombo'),
            lines = this.lookup('lineCombo');

        IM.provider.Map.ymap.setCenter(pos.split(' '), 15);

        tp.store.loadData(this.data['2'].filter( item => item.pid == regionId));
        tp.setValue(null);
        lines.store.removeAll();
        lines.setValue(null);

        this.loadPillars(regionId);
    },

    bindLines: function(regionCombo) {
        var tpId = this.lookup('tpCombo').getValue(),
            lines = this.lookup('lineCombo');

        lines.store.loadData(this.data['3'].filter( item => item.pid == tpId));
        lines.setValue(null);
    },

    enableAddingPillar: function (combo) {
        this.lookup('addPillarBtn').setDisabled(Ext.isEmpty(combo.getValue()));
    },

    addPillar: function () {
        let cursor = IM.provider.Map.ymap.cursors.push('crosshair');

        IM.provider.Map.ymap.events.once('click', (e) => {
            cursor.remove();
            let position = e.get('coords'),
                placeMark = this.createPillar(position, {
                    tp: this.lookup('tpCombo').getValue(),
                    line: this.lookup('lineCombo').getValue(),
                    region: this.lookup('region').getValue(),
                    box: this.lookup('boxTypeCombo').getValue(),
                    description: this.lookup('selectedPillarDescription').getValue(),
                    iconContent: this.lookup('selectedPillarName').getValue()
                }, {
                    preset: 'islands#violetCircleIcon'
                });

            this.submitPillarData(placeMark).done(response => {
                if (response.rowId) placeMark.properties.set('rowId', response.rowId);

                this.setPlaceMarkSelected(placeMark);
                this.movePillar();
            });

        });
    },

    createPillar: function (position, data, preset) {
        let placeMark = new ymaps.Placemark(position, Ext.apply({
            type: 'regionPillar'
        }, data), preset );

        placeMark.events.add('click', this.setPlaceMarkSelected.bind(this, placeMark));
        IM.provider.Map.ymap.geoObjects.add(placeMark);

        return placeMark;
    },

    setPlaceMarkSelected: function (placeMark, event) {
        this.selectedPillar = placeMark;
        this.lookup('selectedPillarDescription').setValue(placeMark.properties.get('description'));
        this.lookup('selectedPillarName').setValue(placeMark.properties.get('iconContent'));
        this.lookup('boxTypeCombo').setValue(placeMark.properties.get('box'));

        this.setLineTp(
            placeMark.properties.get('line'),
            placeMark.properties.get('tp')
        );

        if (event) {
            this.mapContainer.fireEvent('pillarSelected', event.originalEvent);
        }
    },

    setLineTp: function (lineId, tpId) {
        let tp = this.lookup('tpCombo'),
            lines = this.lookup('lineCombo');

        tp.setValue(tpId);
        lines.store.loadData(this.data['3'].filter( item => item.pid === tpId));
        lines.setValue(lineId);
        this.lookup('addPillarBtn').setDisabled(false);
    },

    savePillar: function () {
        this.selectedPillar.properties.set('description', this.lookup('selectedPillarDescription').getValue());
        this.selectedPillar.properties.set('iconContent', this.lookup('selectedPillarName').getValue());
        this.selectedPillar.properties.set('tp', this.lookup('tpCombo').getValue());
        this.selectedPillar.properties.set('line', this.lookup('lineCombo').getValue());
        this.selectedPillar.properties.set('box', this.lookup('boxTypeCombo').getValue());

        this.submitPillarData(this.selectedPillar).done(response => {
            if (response.rowId) this.selectedPillar.properties.set('rowId', response.rowId);
            this.selectedPillar.options.unset('iconColor');
            this.selectedPillar.editor.stopEditing();
        });
    },

    submitPillarData: function (pillar) {
        let pos = pillar.geometry.getCoordinates(),
            props = pillar.properties._data,
            data = {
                name: props.iconContent,
                pos: pos[0] + " " + pos[1]
            };

        return $.post('http://stat.fun.co.ua/geocode.php', {
            action: 'insertMapPillar',
            data: JSON.stringify(Ext.apply(data, props))
        })
    },

    movePillar: function () {
        this.selectedPillar.options.set('iconColor', "#ff0000");
        this.selectedPillar.editor.startEditing();
    },

    updatePillarProperty: function (field) {
        this.selectedPillar.properties.set(field.name, field.getValue());
    }
});