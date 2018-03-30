Ext.define('IM.view.CustomersCommonController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customersCommon',


    init: function () {
        this.regionChangeListeners = [
            this.getView().down('customers'),
            this.getView().down('pillars')
        ]


    },

    onRegionChange: function (combo) {
        this.regionChangeListeners.forEach(
            listener => listener.fireEvent('regionChange', combo.getSelectedRecord())
        );
    },

    bindRegions: function (combo) {
        $.get('http://stat.fun.co.ua/geocode.php', {
            action: 'getMapRegions'
        }).done((data) => {
            combo.store.loadData(data)
        });
    }
});