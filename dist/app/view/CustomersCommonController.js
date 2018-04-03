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
        $.get(IM.app.api, {
            action: 'getMapRegions'
        }).done((data) => {
            combo.store.loadData(data)
        });
    },

    saveAll: function () {
        let pillars = this.lookup('pillars'),
            customers = this.lookup('customers');

        IM.app.toggleMask();
        $.when(
            pillars.updateMapPillars(),
            customers.saveLocations()
        ).then(function( data ) {
            IM.app.toggleMask();
        });
    }
});