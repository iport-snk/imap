Ext.define('IM.view.Pillars', {
    extend: 'Ext.grid.Panel',
    requires: ['IM.view.PillarsController', 'Ext.selection.CellModel'],
    xtype: 'pillars',
    controller: 'pillars',
    forceFit: true,
    selModel: {
        type: 'cellmodel'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'id'},
            {name: 'region'},
            {name: 'tp'},
            {name: 'line'},
            {name: 'name'},
            {name: 'description'}

        ],
        proxy: {
            type: 'ajax',
            reader: {
                type: 'json'
            }
        },
        autoLoad: false
    }),
    tbar:[{
        xtype: 'combobox',
        name: 'regions',
        reference: 'regionCombo',
        store:  {
            type: 'store',
            fields: ['id', 'name', 'pos'],
            autoLoad: false
        },
        listeners: {
            boxready: 'bindRegions',
            change: 'bindTp'
        },
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        queryMode: 'local',
        width: 120,
        emptyText: 'Село ...'
    },{
        xtype: 'combobox',
        reference: 'tpCombo',
        name: 'tp',
        listeners: {
            change: 'bindLines'
        },
        store:  {
            type: 'store',
            fields: ['id', 'name'],
            autoLoad: false
        },
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        queryMode: 'local',
        width: 100,
        emptyText: 'ТП ...'
    },{
        xtype: 'combobox',
        reference: 'lineCombo',
        name: 'lines',
        listeners: {
            change: 'enableAddingPillar'
        },
        store:  {
            type: 'store',
            fields: ['id', 'name'],
            autoLoad: false
        },
        valueField: 'id',
        displayField: 'name',
        typeAhead: true,
        queryMode: 'local',
        width: 100,
        emptyText: 'Л ...'
    }, '->', {
        xtype: 'button',
        reference: 'addFiberButton',
        iconCls: 'x-fa fa-plus-circle',
        disabled: true,
        handler: 'addPillar'
    }],
    columns: [{
        header: 'Номер',
        width: 25,
        dataIndex: 'name',
        editor: {
            allowBlank: false
        }
    },{
        sortable: false,
        menuDisabled: true,
        xtype: 'actioncolumn',
        align: 'center',
        width: 30,
        items: [{
            iconCls: 'x-fa fa-map-marker',
            //handler: 'onPlaceClick',
        }, {
            padding: '0 0 0 10',
            iconCls: 'x-fa fa-map'
            //handler: 'onResolveClick'
        }]
    }]
});
