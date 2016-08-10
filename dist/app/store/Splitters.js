Ext.define('IM.store.Splitters', {
    extend: 'Ext.data.Store',
    storeId: 'Splitters',
    fields: [
        {name: 'box'},
        {name: 'cable'},
        {name: 'fiber'},
        {name: 'coupler'},
        {name: 'splitter'}
    ]

});