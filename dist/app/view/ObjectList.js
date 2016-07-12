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
            {name: 'labels'},
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
                    {text: 'E2', itemId: 'fiberE2'},
                    {text: 'E8', itemId: 'fiberE8'},
                    {text: 'E12', itemId: 'fiberE12'}
                ]}},
                { text: 'Муфта', menu: {itemId: 'addBox', items: [
                    {text: 'FOSC', itemId: 'boxFox'},
                    {text: 'Бокс', itemId: 'boxPon'}
                ]}}
            ]
        }

    },'->', {
        text: 'Удалить',
        itemId: 'btnDel',
        disabled: true
    }],
    columns: [{
        header: 'Тип',
        dataIndex: 'type'
    },{
        header: 'Название',
        dataIndex: 'name',
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },{
        header: 'Метки',
        dataIndex: 'labels',
        flex: 1,
        editor: {
            xtype: 'textfield'
        }


    }]
});