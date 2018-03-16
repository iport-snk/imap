Ext.define('IM.view.ObjectList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ObjectList',
    forceFit: true,
    selModel: 'rowmodel',
    plugins: {
        ptype: 'rowediting',
        clicksToEdit: 2
    },
    store: Ext.create('Ext.data.Store', {
        storeId: 'ObjectList',
        model: 'IM.model.MapObject',
        autoLoad: false
    }),
    tbar:[{
        xtype: 'splitbutton',
        text: 'Добавить',
        menu: {
            items: [
                { text: 'Кабель',   menu: {itemId: 'addFiber', items: [
                    {text: 'E1', itemId: 'E1'},
                    {text: 'E2', itemId: 'E2'},
                    {text: 'E8', itemId: 'E8'},
                    {text: 'E12', itemId: 'E12'}
                ]}}
            ]
        }

    },'->', {
        text: 'Удалить',
        itemId: 'btnDel',
        cls: 'action-btn',
        disabled: true
    },{
        text: 'Изменить',
        itemId: 'btnEdit',
        cls: 'action-btn',
        disabled: true
    }],
    columns: [{
        header: 'Код',
        dataIndex: 'id'
    },{
        header: 'Объект',
        dataIndex: 'type'
    },{
        header: 'Тип',
        dataIndex: 'name'
    },{
        sortable: false,
        menuDisabled: true,
        xtype: 'actioncolumn',
        align: 'center',
        width: 30,
        items: [{
            iconCls: 'x-fa fa-edit',
            handler: (...args) => {
                var go = args[5].get('geoObject');

                if (go.editor.state.get('editing')) {
                    go.editor.stopEditing();
                } else {
                    go.editor.startEditing();
                }

            },
            isDisabled: function() {
                var record = arguments[4];

                return !record.isCable();
            }
        }]
    }]
});