Ext.define('IM.view.Fibers', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.Fibers',
    selModel: {
        mode: 'SINGLE'
    },
    forceFit: false,
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
        header: 'Порт',
        dataIndex: 'name_in',
        flex: 1,
        editor: {xtype: 'textfield'}
    },{
        header: 'Волокно',
        dataIndex: 'chooser_in',
        flex: 1,
        renderer: function(value, metaData, record, rowIndex, colIndex) {
            if (record.get('cable_in')){
                return '<i class="fa fa-circle fiber-color-' + record.get('fiber_in') + '" style="margin-right:5px;"></i>' + record.getNameIn();
            } else return '';
        },
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            //forceSelection: true,
            editable: false,
            listConfig: {
                itemTpl: [
                    '<i class="fa fa-circle fiber-color-{fiber}" style="margin-right:5px;"></i>{name}'
                ]
            },
            listeners: {
                beforequery: function(e){
                    var grid = e.combo.up('grid');
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
        flex: 1,
        dataIndex: 'chooser_out',
        renderer: function(value, metaData, record, rowIndex, colIndex) {
            if (record.get('cable_out')){
                return '<i class="fa fa-circle fiber-color-' + record.get('fiber_out') + '" style="margin-right:5px;"></i>' + record.getNameOut();
            } else return '';
        },
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            //forceSelection: true,
            editable: false,
            listConfig: {
                itemTpl: [
                    '<i class="fa fa-circle fiber-color-{fiber}" style="margin-right:5px;"></i>{name}'
                ]
            },
            listeners: {
                beforequery: function(e){
                    var grid = e.combo.up('grid');
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