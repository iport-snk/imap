Ext.define('IM.controller.ODF', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'ObjectGrid', selector: 'ObjectList'},
        {ref: 'Grid', selector: 'ODF'}
    ],
    control: {
        'ODF #addFiberConnection' : {
            click: 'addFiberConnection'
        },
        'ODF' : {
            beforeEditorQuery: 'beforeEditorQuery',
            edit: 'onCellEdit'
        }

    },

    addFiberConnection: function(){
        var odf = this.getObjectGrid().getSelection()[0],
            rec = this.getGrid().store.add({box: odf.get('geoObject').imap.id});

    },

    getFibers: function(odf){
        var fibers = [];

        odf.imap.cables.forEach(function(cable){
            for (var i = 1; i <= cable.imap.fibers; i++) {
                fibers.push({
                    box: odf.imap.id,
                    cable: cable.imap.id,
                    fiber: i,
                    name: cable.imap.id + ' - ' +  i
                })
            }
        });
        return fibers;
    },

    beforeEditorQuery: function(e){
        var editor = e.grid.editingPlugin,
            record = editor.activeRecord,
            dataIndex = editor.activeColumn.dataIndex == 'name_in' ? 'in' : 'out',
            odf = this.getObjectGrid().getSelection()[0];

        e.store.loadData(this.getFibers(odf.get('geoObject')));
        e.store.clearFilter();
        e.store.filterBy(function(item){
            var connected = {
                'in': e.grid.store.findBy(function(selectedItem){
                    return ( selectedItem.get('cable_in') == item.get('cable') &&
                        selectedItem.get('fiber_in') == item.get('fiber'))
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
        var editor = e.activeEditor.field,
            dataIndex = e.activeColumn.dataIndex,
            record = e.activeRecord,
            sel = editor.findRecordByValue(args.value),
            cable = sel ? sel.get('cable') : null,
            fiber = sel ? sel.get('fiber') : null;

        if (dataIndex == 'name_in') {
            record.set({cable_in: cable, fiber_in: fiber})
        } else if (dataIndex == 'name_out') {
            record.set({cable_out: cable, fiber_out: fiber})
        }
    }
});
