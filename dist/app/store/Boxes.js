Ext.define('IM.store.Boxes', {
    extend: 'Ext.data.Store',
    storeId: 'Boxes',
    fields: [
        {name: 'mapId'},
        {name: 'box'},
        {name: 'cable_in'},
        {name: 'fiber_in'},
        {name: 'channel'},
        {name: 'name_in'},
        {name: 'cable_out'},
        {name: 'fiber_out'},
        {name: 'name_out'}
    ]


});