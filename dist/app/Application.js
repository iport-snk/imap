Ext.define('IM.Application', {
    extend: 'Ext.app.Application',
    namespace: 'IM',
    requires:[
        'Ext.tab.Panel',
        'Ext.data.TreeModel',
        'Ext.layout.container.Border',
        'IM.store.Fibers',
	    'IM.provider.Map',
	    'IM.view.Map',
        'IM.Cars'

    ],
    api: 'https://iport.net.ua/imap/api/geocode.php',

    models: ['Box', 'MapObject', 'Car'],
    controllers: ['ObjectList', 'Box', 'HZ', 'Splitters'],
    stores: ['Fibers', 'Boxes', 'Splitters', 'Cars'],
    appProperty: 'app',

    updateDevices: function () {

    },


    updateEvents: function () {

    },

    socketOnMessage: function (event) {
        var data = Ext.decode(event.data);

        if (data.devices) {
            this.updateDevices(data.devices);
        }
        if (data.positions) {
            this.cars.updatePositions(data.positions);
        }
        if (data.events) {
            this.updateEvents(data.events);
        }
    },

    socketOnClose: function () {
        setTimeout(() => {
            this.socketStart();
        }, 60000);
    },

    socketStart: function () {
        var socket = new WebSocket("ws://df.fun.co.ua:8080/api/socket");

        socket.onclose = this.socketOnClose.bind(this);
        socket.onmessage = this.socketOnMessage.bind(this);
    },

    toggleMask: function () {
        if (!this.mask) {
            this.mask = new Ext.LoadMask({
                msg    : 'Saving ...',
                target : Ext.ComponentQuery.query('viewport')[0]
            })
        }
        this.mask.setVisible(!this.mask.isVisible());
    },

    launch: function () {

        this.cars = new IM.Cars();

        /*var hz = new Horizon();
        this.hz = {
            db: hz,
            geoObjects: hz('GeoObjects'),
            boxes: hz('Boxes'),
            splitters: hz('Splitters'),
            revisions: hz('Revisions')
        };*/
        this.imap = IM.provider.Map;

        $.post('http://df.fun.co.ua:8080/api/session', {
            email: 'info@iport.net.ua',
            password: 'Iport2018'
        }).done((data) => {
            Ext.create('IM.view.Viewport');
            this.socketStart();
        });

        navigator.geolocation.watchPosition(position => {
            this.cars.updatePositions([{
                deviceId: 1111,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                attributes: {
                    motion: false
                }
            }]);
        });

    }
});
