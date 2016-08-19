Ext.define('IM.view.Box', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.Box',
    items: [{
        title: 'Волокна',
        xtype: 'Fibers'
    },{
        title: 'Сплиттеры',
        xtype: 'Splitters'
    }]
});