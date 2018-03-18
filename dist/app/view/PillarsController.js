Ext.define('IM.view.PillarsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pillars',
    selectedPillar: {},
    bindRegions: function (combo) {
        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapRegions'
        }).done((data) => {
            combo.store.loadData(data)
        });
    },

    getObjaectManager: function () {
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
                    description: data.description,
                    iconContent: data.name
                }, {
                    preset: 'islands#blueIcon'
                });
            })

        });
    },

    bindTp: function(regionCombo) {
        //ymaps.geoQuery(IM.provider.Map.ymap.geoObjects).each((o) => console.log(o.properties.get('region')))

        var tp = this.lookup('tpCombo'),
            lines = this.lookup('lineCombo'),
            pos = regionCombo.getSelectedRecord().get('pos').split(' ');

        IM.provider.Map.ymap.setCenter(pos, 15);

        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapTps',
            region: regionCombo.getValue()
        }).done((data) => {
            tp.store.loadData(data);
            tp.setValue(null);
            lines.store.removeAll();
            lines.setValue(null);

            this.loadPillars(regionCombo.getValue());
        })
    },

    bindLines: function(regionCombo) {
        var tp = this.lookup('tpCombo'),
            lines = this.lookup('lineCombo');

        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapLines',
            tp: tp.getValue()
        }).done((data) => {
            lines.store.loadData(data);
            lines.setValue(null);
        })
    },

    enableAddingPillar: function (combo) {
        this.lookup('addFiberButton').setDisabled(Ext.isEmpty(combo.getValue()));
    },

    addPillar: function () {
        var cursor = IM.provider.Map.ymap.cursors.push('crosshair');

        IM.provider.Map.ymap.events.once('click', (e) => {
            cursor.remove();
            var position = e.get('coords'),
                placeMark = this.createPillar(position, {
                    tp: this.lookup('tpCombo').getValue(),
                    line: this.lookup('lineCombo').getValue(),
                    region: this.lookup('regionCombo').getValue(),
                    description: '...',
                    iconContent: '1'
                }, {
                    preset: 'islands#redIcon'
                });


            this.setPlaceMarkSelected(placeMark);
            placeMark.editor.startEditing();

        });
    },

    createPillar: function (position, data, preset) {
        var placeMark = new ymaps.Placemark(position, Ext.apply({
            type: 'regionPillar'
        }, data), preset );

        placeMark.events.add('click', this.setPlaceMarkSelected.bind(this, placeMark));
        IM.provider.Map.ymap.geoObjects.add(placeMark);

        return placeMark;
    },

    setPlaceMarkSelected: function (placeMark) {
        this.selectedPillar = placeMark;
        this.lookup('selectedPillarDescription').setValue(placeMark.properties.get('description'));
        this.lookup('selectedPillarName').setValue(placeMark.properties.get('iconContent'));
    },

    savePillar: function () {
        var name = this.lookup('selectedPillarName').getValue(),
            pos = this.selectedPillar.geometry.getCoordinates(),
            data = Ext.apply({
                pos: pos[0] + " " + pos[1]
            }, this.selectedPillar.properties._data);

        this.selectedPillar.properties.set('description', this.lookup('selectedPillarDescription').getValue());
        this.selectedPillar.properties.set('iconContent', name);

        this.submitPillarData(data).done((response) => {
            if (response.rowId) this.selectedPillar.properties.set('rowId', response.rowId);
            this.selectedPillar.options.set('preset', "islands#blueIcon");
            this.selectedPillar.editor.stopEditing();
        });
    },

    submitPillarData: function (data) {
        return $.post('http://stat.fun.co.ua/geocode.php', {
            action: 'insertMapPillar',
            data: JSON.stringify(Ext.apply({
                name: data.iconContent
            }, data))
        })
    },

    movePillar: function () {
        
        this.selectedPillar.options.set('preset', "islands#redIcon");
        this.selectedPillar.editor.startEditing();
    },

    updatePillarProperty: function (field) {
        this.selectedPillar.properties.set(field.name, field.getValue());
    }
});