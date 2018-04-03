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
        controller: 'customersCommon',
        header: {
            title: 'Объкты',

            //itemPosition: 0,    // before panel title
            itemPosition: 1, // after panel title
            //itemPosition: 2, // after pin tool
            items: [{
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
            },{
                xtype: 'button',
                iconCls: 'x-fa fa-save',
                handler: 'saveAll'
            }]
        },


        width: 400,


        items: [{
            reference: 'pillars',
            xtype: 'pillars',
            border: false
        },{
            flex: 1,
            reference: 'customers',
            xtype: 'customers',
            border: false
        }],



        listeners: {
            afterrender: function(panel){
                //panel.getLayout().setActiveItem(0);
            }
        }
    }]
});