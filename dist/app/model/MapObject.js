Ext.define('IM.model.MapObject', {
    extend: 'Ext.data.Model',
    alternateClassName: 'MapObject',
    statics: {
        CABLE: 'cable',
        BOX: 'box'
    },
    isCable: function () {
        return (this.get('type') == MapObject.CABLE)
    },
    isBox: function () {
        return (this.get('type') == MapObject.BOX)
    },
    isODF: function () {
        return (this.get('name') == 'ODF')
    },
    isFC: function () {
        return (this.get('name') == 'FC')
    },
    fields: [
        {name: 'type'},
        {name: 'name'},
        {name: 'geoObject'}
    ]
});