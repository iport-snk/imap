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
        fields: [
            {name: 'type'},
            {name: 'name'},
            {name: 'geoObject'}
        ],
        autoLoad: false
    }),
    tbar:[{
        xtype: 'splitbutton',
        text: 'Добавить',
        menu: {
            items: [
                { text: 'Кабель',   menu: {itemId: 'addFiber', items: [
                    {text: 'E2', itemId: 'E2'},
                    {text: 'E8', itemId: 'E8'},
                    {text: 'E12', itemId: 'E12'}
                ]}}
            ]
        }

    },'->', {
        text: 'Удалить',
        itemId: 'btnDel',
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
    }]
});