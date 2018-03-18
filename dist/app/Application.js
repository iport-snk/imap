Ext.define('IM.Application', {
    extend: 'Ext.app.Application',
    namespace: 'IM',
    requires:[
        'Ext.tab.Panel',
        'Ext.data.TreeModel',
        'Ext.layout.container.Border',
        'IM.store.Fibers',
	    'IM.provider.Map',
	    'IM.view.Map'

    ],

    models: ['Box', 'MapObject'],
    controllers: ['ObjectList', 'Box', 'HZ', 'Splitters'],
    stores: ['Fibers', 'Boxes', 'Splitters'],
    appProperty: 'app',

    updateDevices: function () {

    },

    updatePositions: function (positions) {
console.log(positions);
    },

    updateEvents: function () {

    },

    socketOnMessage: function (event) {
        var data = Ext.decode(event.data);

        if (data.devices) {
            this.updateDevices(data.devices);
        }
        if (data.positions) {
            this.updatePositions(data.positions);
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

    launch: function () {

        var hz = new Horizon();
        this.hz = {
            db: hz,
            geoObjects: hz('GeoObjects'),
            boxes: hz('Boxes'),
            splitters: hz('Splitters'),
            revisions: hz('Revisions')
        };
        this.imap = IM.provider.Map;

        $.post('http://df.fun.co.ua:8080/api/session', {
            email: 'oleg.k@iport.net.ua',
            password: 'mutabor'
        }).done((data) => {
            Ext.create('IM.view.Viewport');
            this.socketStart();
        });

    }
});
