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
        renderer: function(value, metaData, record, rowIndex, colIndex) {
            return '<i class="fa fa-circle fiber-color-' + record.get('fiber') + '" style="margin-right:5px;"></i>' +
                    record.get('cable') + ' - ' + record.get('fiber');
        },
        editor: {
            xtype: 'combo',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store'),
            displayField: 'name',
            valueField: 'name',
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
        header: 'Каплер',
        dataIndex: 'coupler',
        editor: {
            xtype: 'combo',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            store: Ext.create('Ext.data.Store',{
                fields: ['name'],
                data: [
                    {name: '0/100'},
                    {name: '95/5'},
                    {name: '90/10'},
                    {name: '80/20'},
                    {name: '70/30'},
                    {name: '50/50'}
                ]
            })
        }
    },{
        header: 'Сплиттер',
        dataIndex: 'splitter',
        editor: {
            xtype: 'combo',
            queryMode: 'local',
            valueField: 'name',
            displayField: 'name',
            store: Ext.create('Ext.data.Store',{
                fields: ['name'],
                data: [
                    {name: '1/2'},
                    {name: '1/4'},
                    {name: '1/8'},
                    {name: '1/16'},
                    {name: '1/32'},
                    {name: '1/64'}
                ]
            })
        }
    }]
});