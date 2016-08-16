Ext.define('IM.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'IM.view.ObjectList',
        'IM.view.Fibers',
        'IM.view.Splitters',
        'IM.view.Cable',
        'IM.view.Box'
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

 /*       xtype: 'tabpanel',
        tabBarHeaderPosition: 0,
        titleAlign: 'right',
        title: 'Maps',*/

        collapsible: true,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        header: {
            itemPosition: 0,    // before panel title
            //itemPosition: 1, // after panel title
            //itemPosition: 2, // after pin tool
            items: [{
                xtype: 'button',
                text: 'Сохранить',
                itemId: 'btnSaveMap'
            },{
                xtype: 'button',
                text: 'Загрузить',
                margin: '0 0 0 20',
                itemId: 'btnLoadMap'
            }]
        },


        width: 400,


        items:[{
            xtype: 'ObjectList',
            flex: 1
        },{
            xtype: 'panel',
            layout: 'card',
            itemId: 'ObjectView',
            defaults: { border:false },
            items: [{
                xtype: 'Box'
            },{
                xtype: 'Cable'
            }],
            flex: 1
        }],


        listeners: {
            afterrender: function(panel){
                //panel.getLayout().setActiveItem(0);
            }
        }
    }]
});