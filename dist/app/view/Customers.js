Ext.define('IM.view.Customers', {
    extend: 'Ext.grid.Panel',
    requires: ['IM.view.CustomersController'],
    xtype: 'customers',
    controller: 'customers',
    //forceFit: true,
    selModel: 'rowmodel',
    listeners: {
        regionChange: 'onRegionChange'
    },
    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'contract'},
            {name: 'id'},
            {name: 'street'},
            {name: 'building'},
            {name: 'region'},
            {name: 'pos'},
            {name: 'placeMark'},
            {name: 'box_id'},
            {name: 'props', defaultValue: {}}

        ],
        proxy: {
            type: 'ajax',
            reader: {
                type: 'json'
            }
        },
        autoLoad: false
    }),
    tbar:[{
        text: 'Загрузить',
        itemId: 'btnLoadDistrict',
        cls: 'action-btn',
        xtype: 'splitbutton',
        menu: {
            listeners: {
                click: 'loadStreets'
            },

            items: [{
                text: 'с. Мазiнки',
                pos: '50.164558 31.360411',
                regionId: 15
            },{
                text: 'с. Дiвiчки',
                pos: '50.081975 31.280165',
                regionId: 16
            },{
                text: 'с. Еркiвцi',
                pos: '50.122750 31.254347',
                regionId: 17
            },{
                text: 'с. Ковалин',
                pos: '50.081715 31.211084',
                regionId: 18
            }]

        }
    }, '->', {
        text: 'Сохранить',
        handler: 'saveLocations',
        cls: 'action-btn'
    }],
    actions: {
        place: {
            glyph: 'xf256@FontAwesome',
            handler: 'onPlaceClick'
        },
        resolve: {
            //getClass: 'getBuyClass',
            glyph: 'xf256@FontAwesome',
            handler: 'onResolveClick'
        }
    },
    columns: [{
        header: 'Дог.',
        width: 80,
        dataIndex: 'contract'
    },{
        flex: 1,
        header: 'Улица',
        dataIndex: 'street',
        renderer: function (value) {
            var street = value.split(',')[4];
            return street;
        }
    },{
        header: 'Дом',
        width: 60,
        dataIndex: 'building'
    },{
        sortable: false,
        menuDisabled: true,
        xtype: 'actioncolumn',
        align: 'center',
        width: 60,
        items: [{
            iconCls: 'x-fa fa-map-marker',
            handler: 'onPlaceClick',
            isDisabled: function () {
                var record = arguments[4];

                return Ext.isEmpty(record.get('pos'));
            }
        }, {
            padding: '0 0 0 10',
            iconCls: 'x-fa fa-map',
            handler: 'onResolveClick'
        }, {
            padding: '0 0 0 10',
            iconCls: 'x-fa fa-lightbulb',
            handler: 'onHighlightRelationClick',
            isDisabled: function () {
                var record = arguments[4];

                return Ext.isEmpty(record.get('box_id'));
            }
        }]
    }]
});
