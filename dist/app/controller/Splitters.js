Ext.define('IM.controller.Splitters', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'ObjectGrid', selector: 'ObjectList'},
        {ref: 'Grid', selector: 'Splitters'}
    ],
    control: {
        'Splitters #addSplitter': {
            click: 'addSplitter'
        },
        'Splitters': {
            beforeEditorQuery: 'beforeEditorQuery',
            edit: 'onCellEdit'
        }

    },
    addSplitter: function(){
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

    beforeEditorQuery: function(e) {
        var editor = e.grid.editingPlugin,
            record = editor.activeRecord,
            dataIndex = editor.activeColumn.dataIndex == 'name_in' ? 'in' : 'out',
            odf = this.getObjectGrid().getSelection()[0];
        e.store.loadData(this.getFibers(odf.get('geoObject')));
    },

    onCellEdit: function(e, args) {
        var editor = e.activeEditor.field,
            dataIndex = e.activeColumn.dataIndex,
            record = e.activeRecord,
            sel = editor.findRecordByValue(args.value);

        //record.set({cable: cable, fiber: fiber, splitter_type: splitter_type})

    }
});
