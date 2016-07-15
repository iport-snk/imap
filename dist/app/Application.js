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
    controllers: ['ObjectList', 'ODF'],
    stores: ['Fibers', 'Boxes'],
    launch: function () {
        Ext.create('IM.view.Viewport');
    }
});
