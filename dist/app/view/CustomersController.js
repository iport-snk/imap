Ext.define('IM.view.CustomersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customers',


    init: function () {


    },

    loadStreets: function () {
        //var grid = this.lookup('grid');
        var grid = this.getView();

        //grid.getStore().getProxy().setUrl("http://stat.fun.co.ua/geocode.php?action=getAddresses&region=10");

        $.get("http://stat.fun.co.ua/geocode.php?action=getAddresses&region=10").then(data => {
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
                $('.fa-map-marker', tr).removeClass('red');
                record.get('placeMark').options.set('iconColor', '#1E98FF');
                record.get('placeMark').editor.stopEditing();
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
                    record: record
                }, {
                    preset: 'islands#blueDotIcon'
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

    resolveAddress: function (record) {
        if (Ext.isEmpty(record.get('building'))) return;

        var address = record.get('street') + ',' + record.get('building'),
            here = {
                //url: 'https://geocoder.cit.api.here.com/6.2/geocode.json',
                url: 'https://geocoder.api.here.com/6.2/geocode.json',
                key: {
                    'app_code': 'A-yZC7Ls9bbT-6sIJ1cR1w',
                    'app_id': 'w5wENGWZ4ula2lwOcDTL'
                }
            };


        $.get(here.url, Object.assign({
            searchtext: address
        }, here.key)).then(function (data) {
            var position = data.Response.View[0].Result[0].Location.DisplayPosition,
                mark = record.get('placeMark');

            record.set('pos', position.Latitude + " " + position.Longitude);
            if (mark) {
                mark.geometry.setCoordinates([position.Latitude, position.Longitude]);
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
                location: _.get('pos')
            }));

        $.post("http://stat.fun.co.ua/geocode.php", {
            action: 'updateLocations',
            positions: JSON.stringify(locations)
        }).done(_ => grid.getStore().commitChanges());


    }
});
