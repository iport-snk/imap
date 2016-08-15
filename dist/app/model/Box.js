Ext.define('IM.model.Box', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'mapId'},
        {name: 'box'},
        {name: 'cable_in'},
        {name: 'fiber_in'},
        {name: 'channel'},
        {name: 'channel_name'},
        {name: 'name_in'},
        {name: 'cable_out'},
        {name: 'fiber_out'},
        {name: 'name_out'}
    ],
    getNameIn: function(){
        var name = '';
        if (this.get('cable_in')) {
            name = this.get('cable_in') + ' - ' +  this.get('fiber_in') + (this.get('channel_name') ? '.' + this.get('channel_name') : '');
        }
        return name;
    },

    getNameOut: function() {
        return this.get('cable_out') + ' - ' + this.get('fiber_out');
    },

    replaceCable: function(cableOld, cableNew) {
        if (this.get('cable_in') == cableOld) {
            this.set('cable_in', cableNew);
            this.set('name_in', this.getNameIn());
        }
        if (this.get('cable_out') == cableOld) {
            this.set('cable_out', cableNew);
            this.set('name_out', this.getNameOut());
        }
    }
});