Ext.define('IM.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'IM.view.ObjectList',
        'IM.view.ODF'
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
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        collapsible: true,
        xtype: 'panel',
        width: 400,
        items: [{
            xtype: 'ObjectList',
            flex: 1
        },{
            xtype: 'ODF',
            flex: 1
        }],
        listeners: {
            afterrender: function(panel){
                //panel.getLayout().setActiveItem(0);
            }
        }
    }]
});