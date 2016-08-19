Ext.define('IM.controller.ObjectList', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'Grid', selector: 'ObjectList'},
        {ref: 'BoxGrid', selector: 'Fibers'},
        {ref: 'ObjectView', selector: '#ObjectView'}
    ],
    control: {
        'ObjectList #addFiber' : {
            click: 'addFiber'
        },
        'Map' : {
            objectModified: 'objectModified',
            objectSelected: 'objectSelected'
        },
        'ObjectList' : {
            select: 'gridSelect'
        }

    },

    objectSelected: function(geoObject) {
        var store = this.getGrid().store,
            rec = store.findRecord('id', geoObject.imap.id);

        this.getGrid().getView().focusRow(rec);
        this.getGrid().getSelectionModel().select(rec, false);
    },

    objectModified: function(geoObject) {

        var store = this.getGrid().store,
            rec = store.findRecord('id', geoObject.imap.id),
            editor = this.getGrid().editingPlugin;

        if (rec) {
            this.getGrid().getView().focusRow(rec);
            this.getGrid().getSelectionModel().select(rec, false);
        } else {
            rec = store.add({id: geoObject.imap.id, type: geoObject.imap.type, name: geoObject.imap.name, geoObject: geoObject});
            //editor.cancelEdit();
            //editor.startEdit(rec[0]);
        }

    },
    addFiber: function(menu, item){
        IM.provider.Map.createPolyline([], {type:'cable', name: item.itemId}, true);
    },

    gridSelect: function(grid , record , index , eOpts ){
        var cards = this.getObjectView().getLayout(),
            name = record.get('name');
        if (record.get('type') == 'box') {
            var boxes = Ext.getStore('Boxes'),
                splitters = Ext.getStore('Splitters'),
                boxId = record.get('geoObject').imap.id,
                columns = this.getBoxGrid().getColumns();

            boxes.clearFilter();
            boxes.filter('box', boxId);
            if (name == 'ODF') {
                columns[0].show();
                columns[1].hide();
                columns[2].hide();
                
            } else if (name == 'FC') {
                columns[0].hide();
                columns[1].show();
                columns[2].show();


            }
          
            this.getBoxGrid().getView().refresh();

            splitters.clearFilter();
            splitters.filter('box', boxId);

            cards.setActiveItem(1);
        } else {
            cards.setActiveItem(2);
        }

    }
});
