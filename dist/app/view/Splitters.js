Ext.define('IM.view.Splitters', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.Splitters',
    selModel: {
        mode: 'SINGLE'
    },
    forceFit: true,
    plugins: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    store: 'Splitters',
    tbar:[{
        xtype: 'button',
        text: 'Добавить',
        itemId: 'addSplitter'

    },'->', {
        text: 'Удалить',
        itemId: 'delSplitter',
        disabled: true
    }],
    columns: [{
        header: 'Волокно',
        dataIndex: 'name',
        editor: {
            xtype: 'combo',
            queryMode: 'local',
            valueField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: []
            }),
            displayField: 'name',
            listConfig: {
                itemTpl: [
                    '<i class="fa fa-circle fiber-color-{fiber}" style="margin-right:5px;"></i>{name}'
                ]
            },
            listeners: {
                beforequery: function(e){
                    var grid = Ext.ComponentQuery.query('Splitters')[0];
                    grid.fireEvent('beforeEditorQuery', {grid: grid, store: e.combo.store});
                }
            }
        }
    },{
        header: 'Сплиттер',
        dataIndex: 'splitter_type',
        editor: {
            xtype: 'combo',
            queryMode: 'local'
        }
    }]
});