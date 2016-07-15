Ext.define('IM.view.ODF', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ODF',
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
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            listeners: {
                beforequery: function(e){
                    var grid = Ext.ComponentQuery.query('ODF')[0];
                    grid.fireEvent('beforeEditorQuery', {grid: grid, store: e.combo.store});
                }
            }
        }
    },{
        header: 'Волокно',
        dataIndex: 'name_out',
        editor: {
            xtype: 'combo',
            store: 'Fibers',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            listeners: {
                beforequery: function(e){
                    var grid = Ext.ComponentQuery.query('ODF')[0];
                    grid.fireEvent('beforeEditorQuery', {grid: grid, store: e.combo.store});
                }
            }
        }
    }]
});