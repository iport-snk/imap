Ext.define('IM.view.Customers', {
    extend: 'Ext.grid.Panel',
    requires: ['IM.view.CustomersController'],
    xtype: 'customers',
    controller: 'customers',
    forceFit: true,
    selModel: 'rowmodel',
    plugins: {
        ptype: 'rowediting',
        clicksToEdit: 2
    },
    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'contract'},
            {name: 'id'},
            {name: 'street'},
            {name: 'building'},
            {name: 'region'},
            {name: 'pos'},
            {name: 'placeMark'}

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
        text: 'Load',
        itemId: 'btnLoadDistrict',
        cls: 'action-btn',
        handler: 'loadStreets'
    }, '->', {
        text: 'Resolve',
        handler: 'resolveAll',
        cls: 'action-btn'
    }, {
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
        width: 25,
        dataIndex: 'contract'
    },{
        header: 'Улица',
        dataIndex: 'street',
        renderer: function (value) {
            var street = value.split(',')[4];
            return street;
        }
    },{
        header: 'Дом',
        width: 25,
        dataIndex: 'building'
    },{
        sortable: false,
        menuDisabled: true,
        xtype: 'actioncolumn',
        align: 'center',
        width: 30,
        items: [{
            iconCls: 'x-fa fa-map-marker',
            handler: 'onPlaceClick',
            isDisabled: function() {
                var record = arguments[4];

                return Ext.isEmpty(record.get('pos'));
            }
        }, {
            padding: '0 0 0 10',
            iconCls: 'x-fa fa-map',
            handler: 'onResolveClick'
        }]
    }]
});
