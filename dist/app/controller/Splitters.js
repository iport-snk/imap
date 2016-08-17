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
        e.store.clearFilter();
        e.store.loadData(this.getFibers(odf.get('geoObject')));
        e.store.filterBy(function(item){
            var selectedIdx = e.grid.store.findBy(function(selectedItem){
                return ( selectedItem.get('cable') == item.get('cable') &&
                selectedItem.get('fiber') == item.get('fiber'))
            });
            if (selectedIdx == -1) {
                return true;
            } else {
                var found = e.grid.store.getAt(selectedIdx);
                return (found && found.get('cable') == record.get('cable') && found.get('fiber') == record.get('fiber'));
            }
        });
    },

    onCellEdit: function(e, args) {
        if (args.originalValue == args.value) return;

        var editor = e.activeEditor.field,
            dataIndex = e.activeColumn.dataIndex,
            record = e.activeRecord,
            sel = editor.findRecordByValue(args.value);

        if (dataIndex == 'name' && sel) {
            record.set({cable: sel.get('cable'), fiber: sel.get('fiber')})
        }
        this.calcChannels(record);
    },

    calcChannels: function(record) {

        var splitter = record.get('splitter'),
            coupler = record.get('coupler') || '0/100',
            channels = [],
            cnt = 1;
        if (coupler != '0/100') {
            channels.push({channel: cnt, name: cnt + ':' + coupler.split('/')[0]});
            cnt++;
        }
        if (splitter) {
            var outs = splitter.split('/')[1],
                signal = coupler.split('/')[1];
            for (var i = 0; i < outs; i++) {
                channels.push({channel: cnt, name: cnt + ':' + signal + "/" + outs});
                cnt++;
            }

        } else {
            channels.push({channel: cnt, name: cnt + ':' + coupler.split('/')[1]});
        }
        record.set({channels: channels});
    }
});
