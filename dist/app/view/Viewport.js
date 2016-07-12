Ext.define('IM.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'IM.view.ObjectList'
    ],

    layout: {
        type: 'border',
        padding: 3
    },
    defaults: {
        split: true
    },
    items: [{
        region: 'center',
        layout: 'fit',
        items: [{
            xtype: 'Map',
            layout: 'fit'

        }]
    },{
        region: 'west',
        split: true,
        layout: 'card',
        collapsible: true,
        xtype: 'panel',
        width: 400,
        items: [{
            xtype: 'ObjectList'
        },{
            xtype: 'panel',
            html: '<h1>editing</h1>'
        }],
        listeners: {
            afterrender: function(panel){
                panel.getLayout().setActiveItem(0);
            }
        }
    }]
});