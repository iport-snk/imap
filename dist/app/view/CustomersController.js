Ext.define('IM.view.CustomersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customers',


    init: function () {
        Ext.ComponentQuery.query('Map')[0].on('pillarSelected', this.onPillarClickCtrl.bind(this));
    },

    onRegionChange: function (record) {
        this.loadStreets(record.get('pid'));
    },

    onPillarClickCtrl: function (event) {
        let grid = this.getView(),
            records = grid.selModel.selected.items,
            isCtrl = event.domEvent.originalEvent.ctrlKey,
            marker = event.target,
            pillarId = marker.properties.get('rowId');

        if (records.length === 0) return;

        let record = records[0],
            props = record.get('props');

        if (isCtrl) {
            record.set('box_id', pillarId);
            if (!Ext.isEmpty(props['relation'])) {
                IM.provider.Map.ymap.geoObjects.remove(props.relation);
            }
            props.relation = IM.provider.Map.showRelation(record);
            record.set('props', props);
        }
    },

    loadStreets: function (regionId) {
        let grid = this.getView();

        //var grid = this.lookup('grid');
        ymaps.geoQuery(IM.provider.Map.ymap.geoObjects)
            .search('properties.type=="regionUser"')
            .removeFromMap(IM.provider.Map.ymap);

        //grid.getStore().getProxy().setUrl("http://stat.fun.co.ua/geocode.php?action=getAddresses&region=10");

        $.get("http://stat.fun.co.ua/geocode.php?action=getAddresses&region=" + regionId).then(data => {
            grid.getStore().loadData(data);
            grid.getStore().each(this.placeMark, this);
        })
    },

    onPlaceClick: function (data) {
        var record = arguments[5];

        if (record.get('placeMark')) {
            var tr = arguments[6],
                marker = $('.fa-map-marker', tr);

            if (marker.hasClass('red')) {
                let mark = record.get('placeMark'),
                    coords = mark.geometry.getCoordinates();

                $('.fa-map-marker', tr).removeClass('red');
                //mark.options.set('iconColor', '#1E98FF');
                mark.options.unset('iconColor');
                mark.editor.stopEditing();
                record.set('pos', coords.reduce(
                    (acc, value) => acc + " " + value
                ));
            } else {
                $('.fa-map-marker', tr).addClass('red');
                record.get('placeMark').options.set('iconColor', "#ff0000");
                record.get('placeMark').editor.startEditing();
            }

        } else {
            this.placeMark(record);
        }
    },

    placeMark: function(record) {
        if (Ext.isEmpty(record.get('pos'))) return;

        var position = record.get('pos').split(" "),
            icon = new ymaps.Placemark(
                [position[0], position[1]], {
                    //iconContent: contract,
                    record: record,
                    type: 'regionUser'
                }, {
                    preset: 'islands#yellowHomeCircleIcon'
                    //preset: 'islands#blueStretchyIcon'
                    //iconGlyph: 'home',
                    //iconGlyphColor: 'blue'

                }
            );

        icon.events.add('click', this.handleMarkClick.bind(this));

        IM.provider.Map.ymap.geoObjects.add(icon);
        record.set('placeMark', icon);
        return icon;
    },

    startEditingMark: function () {

    },

    handleMarkClick: function (e) {
        var mark = e.get('target'),
            grid = this.getView(),
            record = mark.properties.get('record');

        grid.selModel.select(record);
        grid.getView().focusRow(record);

    },

    resolveAll: function () {
        this.getView().getStore().each(record => {
            if (!Ext.isEmpty(record.get('pos'))) this.resolveAddress(record);
        })
    },

    resolveYaHttp: function (address) {
        return new Promise((resolve, reject) => {
            $.get({
                url: 'https://geocode-maps.yandex.ru/1.x',
                data: {
                    format: 'json',
                    geocode: address
                },
            }).done( data => {
                debugger;
                let position = data.Response.View[0].Result[0].Location.DisplayPosition;

                resolve([position.Latitude, position.Longitude]);
            })
        });
    },

    resolveYa: function (address) {
        return new Promise((resolve, reject) => {
            ymaps.geocode(address).then( response => resolve(
                response.geoObjects.get(0).geometry.getCoordinates()
            ))
        });
    },

    resolveHere: function (address) {
        return new Promise((resolve, reject) => {
            $.get({
                url: 'https://geocoder.api.here.com/6.2/geocode.json',
                data: {
                    'searchtext': address,
                    'app_code': 'A-yZC7Ls9bbT-6sIJ1cR1w',
                    'app_id': 'w5wENGWZ4ula2lwOcDTL'
                },
            }).done( data => {
                let position = data.Response.View[0].Result[0].Location.DisplayPosition;

                resolve([position.Latitude, position.Longitude]);
            })
        });
    },

    resolveAddress: function (record) {
        if (Ext.isEmpty(record.get('building'))) return;

        let address = record.get('street') + ',' + record.get('building'),
            mark = record.get('placeMark');

        this.resolveYa(address).then(position => {
            record.set('pos', position[0] + " " + position[1]);
            if (mark) {
                mark.geometry.setCoordinates(position);
            } else {
                this.placeMark(record);
            }
        })
    },

    onResolveClick: function () {
        this.resolveAddress(arguments[5]);
    },

    saveLocations: function () {
        var grid = this.getView(),
            records = grid.getStore().getModifiedRecords(),
            locations = records.map(_ => ({
                id: _.get('id'),
                location: _.get('pos'),
                box_id: _.get('box_id')
            }));

        $.post("http://stat.fun.co.ua/geocode.php", {
            action: 'updateLocations',
            positions: JSON.stringify(locations)
        }).done(_ => grid.getStore().commitChanges());


    },



    onHighlightRelationClick: function () {
        let record = arguments[5],
            props = record.get('props');

        props.relation = IM.provider.Map.showRelation(record);



    }
});
