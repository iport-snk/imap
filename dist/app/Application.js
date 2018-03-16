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
        Ext.create('IM.view.Viewport');
    }
});
