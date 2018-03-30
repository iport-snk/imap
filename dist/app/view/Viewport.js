Ext.define('IM.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'IM.view.ObjectList',
        'IM.view.Customers',
        'IM.view.Fibers',
        'IM.view.Splitters',
        'IM.view.Cable',
        'IM.view.Box',
        'IM.view.Pillars',
        'IM.view.CustomersCommonController'
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
             xtype: 'tabpanel',
             //tabBarHeaderPosition: 0,
             //titleAlign: 'right',

            flex: 1,
            items: [{
                title: 'Сеть',
                xtype: 'ObjectList'

            },{
                title: 'Объекты',
                xtype: 'panel',
                layout: 'card',
                itemId: 'ObjectView',
                defaults: { border:false },
                items: [{
                    xtype: 'panel'
                },{
                    xtype: 'Box'
                },{
                    xtype: 'Cable'
                }]
            },{

                title: 'Клиенты',
                xtype: 'panel',
                controller: 'customersCommon',
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                tbar:[{
                    xtype: 'combobox',
                    name: 'regions',
                    reference: 'regionCombo',
                    store:  {
                        type: 'store',
                        fields: ['id', 'name', 'pos', 'pid'],
                        autoLoad: false
                    },
                    listeners: {
                        boxready: 'bindRegions',
                        change: 'onRegionChange'
                    },
                    valueField: 'id',
                    editable: false,
                    forceSelection: true,
                    displayField: 'name',
                    typeAhead: true,
                    queryMode: 'local',
                    flex: 1,
                    emptyText: 'Село ...'
                }],
                items: [{
                    xtype: 'pillars'
                },{
                    flex: 1,
                    xtype: 'customers'
                }]
            }]

        }],


        listeners: {
            afterrender: function(panel){
                //panel.getLayout().setActiveItem(0);
            }
        }
    }]
});