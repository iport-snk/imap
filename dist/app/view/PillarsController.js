Ext.define('IM.view.PillarsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pillars',
    selectedPillar: {},

    data: {},

    init: function () {
        this.mapContainer = Ext.ComponentQuery.query('Map')[0];
        this.loadMapObjects("2");
        this.loadMapObjects("3");

        this.getView().updateMapPillars = this.updateMapPillars.bind(this);
    },

    loadMapObjects: function (type) {
        $.get(IM.app.api, {
            action: 'getMapObjects',
            type: type
        }).done((data) => {
            this.data[type] = data;
        })
    },

    onRegionChange: function (record) {
        let regionId = record.get('id');

        this.data.region = record;
        this.bindTp(regionId, record.get('pos'));

        this.loadPillars(regionId);
    },


    getObjectManager: function () {
        // Оптимальное добавление множества меток
        // https://tech.yandex.ru/maps/jsbox/2.1/object_manager
    },

    loadPillars: function (regionId) {
        ymaps.geoQuery(IM.provider.Map.ymap.geoObjects)
            .search('properties.type=="regionPillar"')
            .removeFromMap(IM.provider.Map.ymap);

        $.get(IM.app.api, {
            action: 'getMapPillars',
            region: regionId
        }).done((data) => {
            let store = this.getView().store;

            store.loadData(data);
            store.each(record => {
                let position = record.get('pos').split(" ");

                record.set(
                    "mark",
                    this.createPillar(position, {
                        record: record,
                        iconContent: record.get('name')
                    }, {
                        preset: 'islands#violetCircleIcon'
                    })
                );
            });
            let newRecord = store.add({id: 0})[0];
            store.commitChanges();

            this.getView().getForm().loadRecord(newRecord);
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
        let cursor = IM.provider.Map.ymap.cursors.push('crosshair'),
            record = this.getView().getForm().getRecord();

        IM.provider.Map.ymap.events.once('click', (e) => {
            cursor.remove();
            let position = e.get('coords'),
                name = this.lookup('selectedPillarName').getValue(),
                placeMark = this.createPillar(position, {
                    iconContent: name
                }, {
                    preset: 'islands#violetCircleIcon'
                }),
                data = Ext.apply({
                    pos: position.reduce((acc, value) => acc + " " + value),
                }, record.getData());

            this.insertPillarData(data).done(response => {
                if (response.rowId) {
                    record.set('id', response.rowId);
                    record.set('mark', placeMark);

                    placeMark.properties.set('record', record);
                }

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
        placeMark.events.add('dragend', this.updateMarkerPosition.bind(this, placeMark));
        IM.provider.Map.ymap.geoObjects.add(placeMark);

        return placeMark;
    },

    setPlaceMarkSelected: function (placeMark, event) {
        let record = placeMark.properties.get('record');

        this.filterLines(record.get('tp'));
        this.getView().getForm().loadRecord(record);

        if (event) {
            this.mapContainer.fireEvent('pillarSelected', event.originalEvent);
        }
    },

    filterLines: function (tpId) {
        let lines = this.lookup('lineCombo');

        lines.store.loadData(this.data['3'].filter( item => item.pid === tpId));
        this.lookup('addPillarBtn').setDisabled(false);
    },

    savePillars: function () {
        IM.app.toggleMask();
        $.when(
            this.updateMapPillars()
        ).then(function( data ) {
            IM.app.toggleMask();
        });
    },

    updateMapPillars: function() {
        let store = this.getView().store,
            modified = store.getModifiedRecords(),
            data = modified.map( record => {
                let item = Ext.apply({}, record.getData());

                delete item.mark;
                return item;
            });

        store.commitChanges();
        return $.post(IM.app.api, {
            action: 'updateMapPillars',
            data: JSON.stringify(data)
        })
    },

    insertPillarData: function (data) {
        delete data.mark;
        delete data.id;
        return $.post(IM.app.api, {
            action: 'insertMapPillar',
            data: JSON.stringify(data)
        })
    },

    movePillar: function () {
        let selectedPillar = this.getView().getForm().getRecord().get('mark');

        if (selectedPillar.editor.state.get('editing')) {
            selectedPillar.options.unset('iconColor');
            selectedPillar.editor.stopEditing();
        } else {
            selectedPillar.options.set('iconColor', "#ff0000");
            selectedPillar.editor.startEditing();
        }
    },

    updatePillarProperty: function (field) {
        let record = this.getView().getForm().getRecord();

        if (record.get('mark')) {
            record.get('mark').properties.set('iconContent', field.getValue());
        }
    },

    updateMarkerPosition: function (marker) {
        let record = marker.properties.get('record'),
            coords = marker.geometry.getCoordinates().reduce((accum, value) => accum + " " + value);

        record.set('pos', coords);
    },

    updateDataRecord: function(form, isDirty) {
        if (isDirty) {
            form.updateRecord();
            form.loadRecord(form.getRecord());
        }
    }
});