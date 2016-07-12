Ext.define('IM.controller.ObjectList', {
    extend: 'Ext.app.Controller',
    refs: [
        {ref: 'Grid', selector: 'ObjectList'}
    ],
    control: {
        'ObjectList #addFiber' : {
            click: 'addFiber'
        },
        'ObjectList #addBox' : {
            click: 'addBox'
        },
        'Map' : {
            objectModified: 'objectModified',
            objectSelected: 'objectSelected'
        }

    },

    objectSelected: function(geoObject) {
        var store = this.getGrid().store,
            rec = store.findRecord('id', geoObject.getId());

        this.getGrid().getView().focusRow(rec);
        this.getGrid().getSelectionModel().select(rec, false);
    },

    objectModified: function(geoObject, type) {

        var store = this.getGrid().store,
            rec = store.findRecord('id', geoObject.getId()),
            editor = this.getGrid().editingPlugin;

        if (rec) {
            this.getGrid().getView().focusRow(rec);
            this.getGrid().getSelectionModel().select(rec, false);
        } else {
            rec = store.add({id: geoObject.getId(), type: type, geoObject: geoObject, name: 'aaa'});
            editor.cancelEdit();
            editor.startEdit(rec[0]);
        }

    },
    addFiber: function(menu, item){
        IM.provider.Map.createPolyline([], item.itemId, true);
    }
});
