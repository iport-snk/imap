Ext.define('IM.view.Pillars', {
    extend: 'Ext.form.Panel',
    requires: ['IM.view.PillarsController'],
    xtype: 'pillars',
    controller: 'pillars',
    forceFit: true,
    trackResetOnLoad: true,
    listeners: {
        regionChange: 'onRegionChange',
        dirtyChange: 'updateDataRecord'
    },
    store: Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'pos', 'region', 'tp', 'line', 'box', 'description', 'mark', 'pos', 'mark']
    }),
    items: [{
        //docked: 'top',
        //xtype: 'toolbar',
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            name: 'name',
            reference: 'selectedPillarName',
            width: 50,
            emptyText: '№',
            listeners: {
                change: 'updatePillarProperty'
            }
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
            queryMode: 'local',
            editable: false,
            forceSelection: true,
            width: 100,
            emptyText: 'ТП ...'
        },{
            xtype: 'combobox',
            reference: 'lineCombo',
            name: 'line',
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
            editable: false,
            forceSelection: true,
            queryMode: 'local',
            width: 100,
            emptyText: 'Л ...'
        },{
            xtype: 'combobox',
            reference: 'boxTypeCombo',
            name: 'box',
            store:  {
                type: 'store',
                fields: ['id', 'name'],
                data: [
                    {id: 'FOB-04', name: 'FOB-04'},
                    {id: 'FOB-12', name: 'FOB-12'},
                    {id: 'Колба', name: 'Колба'}
                ]
            },
            valueField: 'id',
            displayField: 'name',
            editable: false,
            forceSelection: true,
            queryMode: 'local',
            width: 100,
            emptyText: 'Бокс ..'
        }]
    }, {
        //docked: 'top',
        //xtype: 'toolbar',
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            name: 'description',
            reference: 'selectedPillarDescription',
            flex: 1,
            emptyText: 'Коментарий'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-plus-circle',
            disabled: true,
            reference: 'addPillarBtn',
            handler: 'addPillar'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-map-marker',
            handler: 'movePillar'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-save',
            handler: 'savePillars'
        }]
    }]
});
