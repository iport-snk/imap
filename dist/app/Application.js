Ext.define('IM.Application', {
    extend: 'Ext.app.Application',
    namespace: 'IM',
    requires:[
        'Ext.tab.Panel',
        'Ext.data.TreeModel',
        'Ext.layout.container.Border',
	    'IM.provider.Map',
	    'IM.view.Map'
    ],

    models: [],
    controllers: ['ObjectList'],
    stores: [],
    launch: function () {
        Ext.create('IM.view.Viewport');
    }
});
