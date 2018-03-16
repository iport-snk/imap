Ext.define('IM.view.Pillars', {
    extend: 'Ext.panel.Panel',
    requires: ['IM.view.PillarsController'],
    xtype: 'pillars',
    controller: 'pillars',
    forceFit: true,
    items: [{
        docked: 'top',
        xtype: 'toolbar',
        items: [{
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
            flex: 1,
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
        },  {
            xtype: 'button',
            reference: 'addFiberButton',
            iconCls: 'x-fa fa-plus-circle',
            disabled: true,
            handler: 'addPillar'
        }]
    }, {
        docked: 'top',
        xtype: 'toolbar',
        items: [{
            xtype: 'textfield',
            name: 'iconContent',
            reference: 'selectedPillarName',
            width: 40,
            listeners: {
                change: 'updatePillarProperty'
            }
        },{
            xtype: 'textfield',
            name: 'description',
            reference: 'selectedPillarDescription',
            flex: 1,
            listeners: {
                change: 'updatePillarProperty'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-edit',
            handler: 'movePillar'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-save',
            handler: 'savePillar'
        }]
    }]
});
