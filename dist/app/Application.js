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

    models: [],
    controllers: ['ObjectList', 'ODF', 'HZ', 'Splitters'],
    stores: ['Fibers', 'Boxes', 'Splitters'],
    appProperty: 'app',
    launch: function () {
        var hz = new Horizon();
        this.hz = {
            db: hz,
            geoObjects: hz('GeoObjects'),
            boxes: hz('Boxes'),
            revisions: hz('Revisions')
        };
        Ext.create('IM.view.Viewport');
    }
});
