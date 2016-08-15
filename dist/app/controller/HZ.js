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
    getRevision: function(){
        return new Ext.Promise(function (resolve, reject) {
            IM.app.hz.revisions.store({
                date: new Date(),
                user: 'n/a'
            }).subscribe(
                // write
                function(revision) {
                    resolve(revision.id)
                },
                // error
                function(err) {
                    console.error(err)
                }

            )
        })

    },
    getObjects: function(mapId, revisionId) {
        var store = Ext.getStore('ObjectList'),
            geoObjects = [];
        store.each(function(record){
            var gObj = record.get('geoObject'),
                item = {
                    mapId: mapId,
                    revisionId: revisionId,
                    id: record.get('id'),
                    name: record.get('name'),
                    type: record.get('type'),
                    coordinates: gObj.geometry.getCoordinates()
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
    getFibers: function(mapId, revisionId) {
        var objs = [];
        Ext.getStore('Boxes').getData().getSource().each(function(record){
            var data = record.getData();
            objs.push({
                mapId: mapId,
                revisionId: revisionId,
                box: data.box,
                cable_in: data.cable_in,
                fiber_in: data.fiber_in,
                channel: data.channel,
                channel_name: data.channel_name,
                name_in: data.name_in,
                cable_out: data.cable_out,
                fiber_out: data.fiber_out,
                name_out: data.name_out
            })
        });
        return objs;
    },
    getSplitters: function(mapId, revisionId) {
        var objs = [];
        Ext.getStore('Splitters').getData().getSource().each(function(record){
            var data = record.getData();
            objs.push({
                mapId: mapId,
                revisionId: revisionId,
                box: data.box,
                cable: data.cable,
                fiber: data.fiber,
                channels: data.channels,
                coupler: data.coupler,
                splitter: data.splitter
            })
        });
        return objs;
    },
    saveMap: function(){
        var me = this;
        this.getRevision().then(function(revisionId){
            var mapId = 'default',
                objects = me.getObjects(mapId, revisionId),
                fibers = me.getFibers(mapId, revisionId),
                splitters = me.getSplitters(mapId, revisionId);

            IM.app.hz.geoObjects.upsert(objects);
            IM.app.hz.boxes.upsert(fibers);
            IM.app.hz.splitters.upsert(splitters);

        });
    },
    loadGeoObjects: function(mapId, revisionId) {
        var me = this;

        IM.app.hz.geoObjects.findAll({revisionId: revisionId}).fetch().subscribe(
            function(result) {
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
    loadBoxFibers: function(mapId, revisionId){
        var me = this,
            store = Ext.getStore('Boxes');
        IM.app.hz.boxes.findAll({revisionId: revisionId}).fetch().subscribe(
            function(result) {
                console.log(result);
                result.forEach(function(data){
                    store.add({
                        id: data.id,
                        box: data.box,
                        mapId: data.mapId,
                        cable_in: data.cable_in,
                        fiber_in: data.fiber_in,
                        name_in: data.name_in,
                        channel: data.channel,
                        channel_name: data.channel_name,
                        cable_out: data.cable_out,
                        fiber_out: data.fiber_out,
                        name_out: data.name_out
                    });
                });
            },
            function(err) {
                console.log(err);
            }
        )
    },
    loadSplitters: function(mapId, revisionId){
        var me = this,
            store = Ext.getStore('Splitters');
        IM.app.hz.splitters.findAll({revisionId: revisionId}).fetch().subscribe(
            function(result) {
                console.log(result);
                result.forEach(function(data){
                    store.add({
                        id: data.id,
                        box: data.box,
                        mapId: data.mapId,
                        cable: data.cable,
                        fiber: data.fiber,
                        channels: data.channels,
                        coupler: data.coupler,
                        splitter: data.splitter
                    });
                });
            },
            function(err) {
                console.log(err);
            }
        )
    },
    loadMap: function(){
        var me = this;
        IM.app.hz.revisions.order("date", "descending").limit(1).fetch().subscribe(function(revisions){
            if (revisions.length > 0){
                var revId = revisions[0].id;
                me.loadGeoObjects('default', revId);
                me.loadBoxFibers('default', revId);
                me.loadSplitters('default', revId);
            }
        }, function(err){
            debugger;
        });

    }
});
