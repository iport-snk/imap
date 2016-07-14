Ext.define("IM.provider.Map", {
    singleton: true,
    ymap: {},
    container: {},

    newId: function(type, name){
        return name + '.' + Ext.getStore('ObjectList').getData().filterBy(function(item){
            return (item.get('type') == type && item.get('name') == name)
        }).getCount()
    },

    // common methods
    getId: function(){
        var idx = Ext.Array.findBy(
            Ext.Object.getKeys(this),
            function(item){return Ext.String.startsWith(item, 'id_')}
        );
        return this[idx];
    },

    // box methods
    setCoordinatesAll: function(newCoords, originalObject){
        var box = this;

        box.geometry.setCoordinates(newCoords);
        box.imap.cables.forEach(function(cable){
            if (cable.imap.id == originalObject.imap.id) return;

            var positions = [
                {name: 'first', index: 0},
                {name: 'last',  index: cable.geometry.getLength() - 1}
            ];

            positions.forEach(function(position){
                var cableBox = cable.imap.boxes[position.name];
                if (cableBox && cableBox.imap.id == box.imap.id) {
                    cable.geometry.set(position.index, newCoords)
                }
            })
        })
    },

    // cable methods
    detach: function(box){
        var cable = this;

        ['first', 'last'].forEach(function(position){
            if (cable.imap.boxes[position].id == box.imap.id) cable.imap.boxes[position] = null;
        });

        var cableIdx = box.imap.cables.findIndex(function(item){
            return (item.imap.id == cable.imap.id)
        });
        if (cableIdx > -1) box.imap.cables.splice(cableIdx, 1);
    },

    attachToClosestBox: function(index, coords){
        var polyline = this,
            map = polyline.getMap(),
            closestBox = ymaps.geoQuery(map.geoObjects).search('geometry.type == "Point"').searchIntersect(map).getClosestTo(coords),
            position = index == 0 ? 'first' : 'last';

        if (closestBox) {
            closestBox.imap.cables.push(polyline);
            polyline.geometry.set(index, closestBox.geometry.getCoordinates());
            polyline.imap.boxes[position] = closestBox;
        }
    },

    updateAttachedObjects: function(newCoords, oldCoords){
        var polyline = this,
            positions = [
                {name: 'first', index: 0},
                {name: 'last',  index: polyline.geometry.getLength() - 1}
            ];

        if (newCoords.length == oldCoords.length){
            positions.forEach(function(position){
                if (newCoords[position.index][0] != oldCoords[position.index][0] || newCoords[position.index][1] != oldCoords[position.index][1]) {
                    var box = polyline.imap.boxes[position.name];
                    //if (newCoords[position.index][0] != oldCoords[position.index][0] || newCoords[position.index][1] != oldCoords[position.index][1]) {
                    if (box) box.imap.setCoordinatesAll(newCoords[position.index], polyline);
                }


            });
        }

    },

    createPolyline: function(coords, type, editable){

        var me = this,
            cableDescription = {
                E2: {strokeColor: "#00000088", strokeWidth: 2},
                E8: {strokeColor: "#00000088", strokeWidth: 4},
                E12: {strokeColor: "#00000088", strokeWidth: 6}
            },
            polyline = new ymaps.Polyline(coords, {}, {
                strokeColor: cableDescription[type].strokeColor,
                strokeWidth: cableDescription[type].strokeWidth,
                editorMaxPoints: 999999,
                editorMenuManager: function (items, e) {
                    var coords = e.geometry.getCoordinates(),
                        box = Ext.Array.findBy(polyline.imap.boxes, function(item){
                            if (item.index == e._index) return item.object;
                        });
                    items.push({
                        title: "Завершить редактирование",
                        onClick: function () {
                            polyline.editor.stopEditing();
                            me.container.fireEvent('objectModified', polyline)
                        }
                    });

                    if (box) {
                        items.push({
                            title: "Удалить муфту",
                            onClick: function (menu, item) {

                            }
                        },{
                            title: "Отсоединить",
                            onClick: function (menu, item) {
                                polyline.imap.detach(box.object);
                            }
                        });
                    } else {
                        items.push({
                            title: "Установить муфту",
                            onClick: function (menu, item) {
                                var point = me.createPlacemark(coords, 'ODF', 'PON BOX', polyline),
                                    boxPosition = e.index == 0 ? 'first': 'last';

                                polyline.imap.boxes[boxPosition] = point;
                                me.container.fireEvent('objectModified', point);
                            }
                        },{
                            title: "Присоединить",
                            onClick: function () {
                                polyline.imap.attachToClosestBox(e._index, coords);
                            }
                        });
                    }

                    return items;
                }
            });

        polyline.editor.events.add(['vertexadd', 'change'], function(){

        }, {polyline: polyline, self: this});

        // Custom properties/methods
        polyline.imap = {
            id: me.newId('cable', type),
            getId: this.getId.bind(polyline),
            detach: this.detach.bind(polyline),
            attachToClosestBox: this.attachToClosestBox.bind(polyline),
            updateAttachedObjects: this.updateAttachedObjects.bind(polyline),
            boxes: {first: null,last: null},
            type: 'cable',
            name: type
        };


        this.ymap.geoObjects.add(polyline);
        if (editable) {
            polyline.editor.startEditing();
            polyline.editor.startDrawing();
        }

        polyline.events.add('dblclick', function(){
            this.polyline.editor.startEditing();
        }, {polyline: polyline, self: this});

        polyline.events.add('click', function(){
            me.container.fireEvent('objectSelected', polyline)
        }, {polyline: polyline, self: this});

        polyline.events.add('geometrychange', function(e){
            var event = e.originalEvent.originalEvent.originalEvent,
                newCoords = event.newCoordinates,
                oldCoords = event.oldCoordinates;

            polyline.imap.updateAttachedObjects(newCoords, oldCoords);
        }, {polyline: polyline, self: this});




        /*polyline.events.add('editorstatechange',function(){
            console.log(this.polyline.editor.state);
            if (this.polyline.editor.state.get('editing')) {
                //this.polyline.editor.stopEditing();
                this.polyline.editor.stopDrawing();
                //this.self.addLineBtn.deselect();

                var coords = this.polyline.geometry.getCoordinates();
                //this.self.openBaloon(coords[coords.length - 1], polyline);
                this.self.container.fireEvent('polylineAdded', this.polyline, coords, type)
            }
        }, {polyline: polyline, self: this});*/

        return polyline;
    },
    createPlacemark: function(coords, type, caption, polyline) {
        var me = this,
            point = new ymaps.Placemark(coords, {
                iconContent: caption
            }, {
                preset: 'islands#blueStretchyIcon'
            });

        point.imap = {
            getId: this.getId.bind(point),
            setCoordinatesAll: this.setCoordinatesAll.bind(point),
            id: me.newId('box', type),
            type: 'box',
            name: type,
            cables: [polyline]
        };

        point.events.add('click', function(){
            me.container.fireEvent('objectSelected', point)
        }, {point: point, self: this});
        this.ymap.geoObjects.add(point);
        return point;
    },
    openBaloon: function(coords, _opener){
        var helper = this,
            map = this.ymap;
        if (!this.ymap.balloon.isOpen()) {
            //if (_opener) this.ymap.balloon._opener = _opener;
            this.ymap.balloon.events.add('close', function(){
                Ext.getCmp('extBaloon').close();
            });
            this.ymap.balloon.open(coords, {
                contentBody: '<div id="geoobject-baloon" style="width:400px;height:400px;"></div>'
            }).then(function(){
                var ctx = this;
                form = Ext.create('Ext.form.Panel', {
                    id: 'extBaloon',
                    height: 400,
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'textfield',
                        margin: '0 5 0 0',
                        name: 'name',
                        fieldLabel: 'Name'
                    }, {
                        xtype: 'textareafield',
                        margin: '0 5 0 0',
                        fieldLabel: 'Description',
                        flex: 1
                    }],
                    buttons: [{
                        margin: '0 20 0 0',
                        text: 'Submit',
                        handler: function(){
                            var form = this.up('form'),
                                name = form.down('[name=name]').getValue(),
                                coords = ctx.panel.ymap.balloon.getPosition();


                            if (ctx.geoObject) {
                                Ext.getStore('GeoObjects').create('polyline', name, ctx.geoObject.geometry.getCoordinates());
                            } else {
                                Ext.getStore('GeoObjects').create('placemark', name, [coords]);
                                ctx.panel.createPlacemark(coords, name);
                            }

                            map.balloon.close();

                        }
                    }]
                }).render(Ext.fly("geoobject-baloon"))

            }, null, null, {panel:helper, geoObject: _opener});
        } else {
            this.ymap.balloon.close();
        }
    },
    initMap: function(panel) {
        if (Ext.isEmpty(ymaps)) return;

        this.container = panel;
        var helper = this,
            ymap = this.ymap = new ymaps.Map (panel.body.el.dom, {
                center: [50.352307, 30.957459],
                zoom: 12,
                controls: ['zoomControl']
            }),
            addMarkerBtn = this.addMarkerBtn = new ymaps.control.Button({
                data: { image: '/css/y-btn-add.png'}
            }),
            addLineBtn = this.addLineBtn = new ymaps.control.Button({
                data: { image: '/css/y-btn-add-line.png'}
            });

        addMarkerBtn.events.add('click', function () {
            addLineBtn.deselect();
        });
        addLineBtn.events.add('select', function () {
            addMarkerBtn.deselect();
            var polyline = helper.createPolyline([], null, true);
        }, addLineBtn);

        ymap.controls.add(addMarkerBtn);
        ymap.controls.add(addLineBtn);

        ymap.events.add('click', function (e) {
            var coords = e.get('coords'),
                map = e.get('map');

            if (this.markerBtn.isSelected()) {
                helper.createPlacemark(coords);
            } else if (this.lineBtn.isSelected()){

            }
        }, {markerBtn: addMarkerBtn, lineBtn: addLineBtn});

        panel.on('resize', function(){
            ymap.container.fitToViewport()
        });
        //this.loadGeoObjects();


    }
});