Ext.define('IM.controller.Box', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'ObjectGrid', selector: 'ObjectList'},
        {ref: 'Grid', selector: 'Fibers'}
    ],
    control: {
        'Fibers #addFiberConnection' : {
            click: 'addFiberConnection'
        },
        'Fibers' : {
            beforeEditorQuery: 'beforeEditorQuery',
            edit: 'onCellEdit',
            lightFiber: 'onLightFiber'
        }

    },

    onLightFiber: function(e){
        //var fibers = this.findConnectedFibers(e.record, e.direction);
        //var lines = this.drawFibers(fibers);
        var root = {
            cable: e.record.get('cable_in'),
            fiber: e.record.get('fiber_in')
        };
        for (var fiber of this.getChilds(root)) {
            console.log(fiber);
        }

    },

    drawFibers: function(fibers){
        var store = Ext.getStore('ObjectList');
        return fibers.map(function(fiber){
            var cable = store.getDataSource().findBy(function(record) {
                return (record.get('type') == 'cable' && record.get('id') == fiber.cable)
            });
            var coords = cable.get('geoObject').geometry.getCoordinates();
            return IM.provider.Map.createFiber(coords, fiber.fiber);
        });

    },

    findConnectedFibers: function(boxConnection, dir){
        var fibers = [],
            conn = boxConnection,
            store = Ext.getStore('Boxes'),
            direction = dir,
            cable = conn.get('cable_' + direction),
            fiber = conn.get('fiber_' + direction);

        do {
            fibers.push({cable: cable, fiber: fiber});
            conn = store.getDataSource().findBy(function(record) {
                return (
                    (record.get('cable_in') == cable && record.get('fiber_in') == fiber) ||
                    (record.get('cable_out') == cable && record.get('fiber_out') == fiber)
                    ) && (conn.get('id') != record.get('id'));

            });
            if (conn) {
                direction = conn.get('cable_in') == cable ? 'out' : 'in';
                cable = conn.get('cable_' + direction);
                fiber = conn.get('fiber_' + direction);
            }
        } while (conn && cable);
        return fibers;
    },

    getChilds: function* (node){
        var store = Ext.getStore('Boxes'),
            me = this,
            childs = [];

        store.getDataSource().filterBy(function(item){
            return ( item.get('cable_in') == node.cable &&
                     item.get('fiber_in') == node.fiber)
        }).each(function(item){
            childs.push( {'cable' : item.get('cable_out'), 'fiber': item.get('fiber_out')});
        });

        for (var i = 0; i < childs.length; i++) {
            if (childs[i].cable) {
                yield childs[i];
                yield *me.getChilds(childs[i]);
            }

        }

        return;

    },

    loopBoxes: function* (box, cable, fiber, direction){
        var store = Ext.getStore('Boxes'),
            dir = direction,
            cable = connection.get('cable_' + direction),
            fiber = connection.get('fiber_' + direction);

        yield {cable: cable, fiber: fiber};
        do {

        } while (conn && cable);
        return;

    },

    addFiberConnection: function(){
        var odf = this.getObjectGrid().getSelection()[0],
            rec = this.getGrid().store.add({box: odf.get('geoObject').imap.id});

    },

    getFibers: function(odf, direction){
        var fibers = [],
            splitters = Ext.getStore('Splitters');

        odf.imap.cables.forEach(function(cable){
            for (var i = 1; i <= cable.imap.fibers; i++) {
                var idx;
                if (direction == 'in' && (idx = splitters.findBy(function(t){
                    return (t.get('box') == odf.imap.id && t.get('cable') == cable.imap.id && t.get('fiber') == i)
                })) > -1 ) {

                    var channels = splitters.getAt(idx).get('channels');
                    channels.forEach(function(channel){
                        fibers.push({
                            box: odf.imap.id,
                            cable: cable.imap.id,
                            fiber: i,
                            channel: channel.channel,
                            channel_name: channel.name,
                            name: cable.imap.id + ' - ' +  i + '.' + channel.name
                        })
                    })


                } else {
                    fibers.push({
                        box: odf.imap.id,
                        cable: cable.imap.id,
                        fiber: i,
                        channel: 1,
                        name: cable.imap.id + ' - ' +  i
                    })
                }

            }
        });
        return fibers;
    },

    beforeEditorQuery: function(e){
        var editor = e.grid.editingPlugin,
            record = editor.activeRecord,
            dataIndex = editor.activeColumn.dataIndex == 'name_in' ? 'in' : 'out',
            odf = this.getObjectGrid().getSelection()[0];

        e.store.loadData(this.getFibers(odf.get('geoObject'), dataIndex));
        e.store.clearFilter();
        e.store.filterBy(function(item){
            var connected = {
                'in': e.grid.store.findBy(function(selectedItem){
                    return ( selectedItem.get('cable_in') == item.get('cable') &&
                        selectedItem.get('fiber_in') == item.get('fiber') &&
                        selectedItem.get('channel') == item.get('channel'))
                }),
                'out': e.grid.store.findBy(function(selectedItem){
                    return ( selectedItem.get('cable_out') == item.get('cable') &&
                        selectedItem.get('fiber_out') == item.get('fiber'))
                })
            };
            if (connected.in == -1 && connected.out == -1) return true;


            if (
                e.grid.store.getAt(connected[dataIndex]) &&
                (e.grid.store.getAt(connected[dataIndex]).get('cable_' + dataIndex) == record.get('cable_' + dataIndex)) &&
                (e.grid.store.getAt(connected[dataIndex]).get('fiber_' + dataIndex) == record.get('fiber_' + dataIndex))
            ) return true;

            return false;


        });
    },
    onCellEdit: function(e, args) {
        if (args.originalValue == args.value) return;

        var editor = e.activeEditor.field,
            dataIndex = e.activeColumn.dataIndex,
            record = e.activeRecord,
            sel = editor.findRecordByValue(args.value),
            cable = sel ? sel.get('cable') : null,
            fiber = sel ? sel.get('fiber') : null,
            channel = sel ? sel.get('channel') : null;


        if (dataIndex == 'name_in' && sel) {
            record.set({cable_in: cable, fiber_in: fiber, channel: channel, channel_name: sel.get('channel_name')})
        } else if (dataIndex == 'name_out') {
            record.set({cable_out: cable, fiber_out: fiber})
        }
    }
});
