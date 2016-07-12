Ext.define('IM.view.Map', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.Map',
    height: 100,
    initMap: function() {

    },
    listeners: {
        afterrender: function(panel) {
            panel.ymap = IM.provider.Map.initMap(panel);


        }
    }
})