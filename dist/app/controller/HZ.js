Ext.define('IM.controller.HZ', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'btnSaveMap', selector: '#btnSaveMap'},
        {ref: 'Map', selector: 'Map'}
    ],
    control: {
        '#btnSaveMap' : {
            click: 'saveMap'
        },
        '#btnLoadMap' : {
            click: 'loadMap'
        }

    },
    getObjects: function(mapId) {
        var store = Ext.getStore('ObjectList'),
            geoObjects = [];
        store.each(function(record){
            var gObj = record.get('geoObject'),
                item = {
                    id: record.get('id'),
                    name: record.get('name'),
                    type: record.get('type'),
                    coordinates: gObj.geometry.getCoordinates(),
                    mapId: mapId

                };
            if (item.type == 'cable') {
                var fbox = gObj.imap.boxes.first ? gObj.imap.boxes.first.imap.id : null,
                    lbox = gObj.imap.boxes.last ? gObj.imap.boxes.last.imap.id : null;
                Ext.apply(item, {
                    boxes: {first: fbox,last: lbox},
                    fibers: gObj.imap.fibers
                })
            } else if (item.type == 'box') {
                item.cables = gObj.imap.cables.map(function(cable){
                    return cable.imap.id;
                })
            }
            geoObjects.push(item)
        });
        return geoObjects;
    },
    getFibers: function(mapId) {
        var fibers = [];
        Ext.getStore('Boxes').getData().getSource().each(function(record){
            var data = record.getData();
            fibers.push({
                mapId: mapId,
                id: data.box + ':' + data.cable_in + ':' + data.fiber_in + ':' + data.cable_out + ':' + data.fiber_out,
                box: data.box,
                cable_in: data.cable_in,
                fiber_in: data.fiber_in,
                cable_out: data.cable_out,
                fiber_out: data.fiber_out
            })
        });
        return fibers;
    },
    saveMap: function(){
        var mapId = 'default';
        var objects = this.getObjects(mapId),
            fibers = this.getFibers(mapId);


        IM.app.hz.geoObjects.upsert(objects);


        IM.app.hz.boxes.upsert(fibers);
        debugger;
    },
    loadGeoObjects: function(mapId) {
        var me = this;

        IM.app.hz.geoObjects.findAll({mapId: mapId}).fetch().subscribe(
            function(result) {
                console.log(result);
                result.forEach(function(item){
                    item.geoObject = IM.provider.Map.createObject(item);
                });
                // dependencies resolving
                result.forEach(function(item){
                    item.geoObject.imap.resolveDependencies(result);
                    me.getMap().fireEvent('objectModified', item.geoObject);
                })
            },
            function(err) {
                console.log(err);
            }
        )
    },
    loadBoxFibers: function(mapId){
        var me = this,
            store = Ext.getStore('Boxes');
        IM.app.hz.boxes.findAll({mapId: mapId}).fetch().subscribe(
            function(result) {
                console.log(result);
                result.forEach(function(data){
                    store.add({
                        id: data.id,
                        box: data.box,
                        mapId: data.mapId,
                        cable_in: data.cable_in,
                        fiber_in: data.fiber_in,
                        cable_out: data.cable_out,
                        fiber_out: data.fiber_out
                    });
                });
            },
            function(err) {
                console.log(err);
            }
        )
    },
    loadMap: function(){
        this.loadGeoObjects('default');
        this.loadBoxFibers('default');
    }
});
