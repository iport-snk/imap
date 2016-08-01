Ext.define('IM.view.ODF', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ODF',
    selModel: {
        mode: 'SINGLE'
    },
    forceFit: true,
    plugins: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        listeners: {
            beforeedit: function(obj) {

            }
        }
    }),
    store: 'Boxes',
    tbar:[{
        xtype: 'button',
        text: 'Добавить',
        itemId: 'addFiberConnection'

    },'->', {
        text: 'Удалить',
        itemId: 'btnDel',
        disabled: true
    }],
    columns: [{
        header: 'Волокно',
        dataIndex: 'name_in',
        renderer: function(value, metaData, record, rowIndex, colIndex) {
            if (record.get('cable_in')){
                return '<i class="fa fa-circle fiber-color-' + record.get('fiber_in') + '" style="margin-right:5px;"></i>' +
                    record.get('cable_in') + ' - ' + record.get('fiber_in');
            } else return '';
        },
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            listConfig: {
                itemTpl: [
                    '<i class="fa fa-circle fiber-color-{fiber}" style="margin-right:5px;"></i>{name}'
                ]
            },
            listeners: {
                beforequery: function(e){
                    var grid = Ext.ComponentQuery.query('ODF')[0];
                    grid.fireEvent('beforeEditorQuery', {grid: grid, store: e.combo.store});
                }
            }
        }
    },{
        xtype: 'actioncolumn',
        width: 20,
        sortable: false,
        menuDisabled: true,
        items: [{
            iconCls: 'fa fa-lightbulb-o',
            tooltip: 'Просветить',
            handler: function(view, rowIndex, colIndex, item, e, record, row, action) {
                view.grid.fireEvent('lightFiber', {
                    direction: 'in',
                    record: record
                });
            }
        }]
    },{
        header: 'Волокно',
        dataIndex: 'name_out',
        renderer: function(value, metaData, record, rowIndex, colIndex) {
            if (record.get('cable_out')){
                return '<i class="fa fa-circle fiber-color-' + record.get('fiber_out') + '" style="margin-right:5px;"></i>' +
                    record.get('cable_out') + ' - ' + record.get('fiber_out');
            } else return '';
        },
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            listConfig: {
                itemTpl: [
                    '<i class="fa fa-circle fiber-color-{fiber}" style="margin-right:5px;"></i>{name}'
                ]
            },
            listeners: {
                beforequery: function(e){
                    var grid = Ext.ComponentQuery.query('ODF')[0];
                    grid.fireEvent('beforeEditorQuery', {grid: grid, store: e.combo.store});
                }
            }
        }
    },{
        xtype: 'actioncolumn',
        width: 20,
        sortable: false,
        menuDisabled: true,
        items: [{
            iconCls: 'fa fa-lightbulb-o',
            tooltip: 'Просветить',
            handler: function(view, rowIndex, colIndex, item, e, record, row, action) {
                view.grid.fireEvent('lightFiber', {
                    direction: 'out',
                    record: record
                });
            }
        }]
    }]
});