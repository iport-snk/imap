Ext.define("IM.provider.Map", {
    singleton: true,
    ymap: {},
    container: {},
    getId: function(){
        var idx = Ext.Array.findBy(
            Ext.Object.getKeys(this),
            function(item){return Ext.String.startsWith(item, 'id_')}
        );
        return this[idx];
    },
    setCoordinatesAll: function(newCoords, oldCoords){
        this.geometry.setCoordinates(newCoords);
        this.cables.forEach(function(cable){
            var cablePoints = cable.geometry.getCoordinates();
            var idx = cablePoints.findIndex(function(point){
                return (point[0] == oldCoords[0] && point[1] == oldCoords[1])
            });
            if (idx > -1) cable.geometry.set(idx, newCoords);
        })
    },
    /**
     * Places a polyline on the map representing fiber cable of following type
     * E2, E8, E12 ..
     *
     * @param {Array} coords The coords if we restoring object state empty otherwise
     * @param {String} type Variable number of parameters are passed to handlers.
     * @param {Boolean} editable .
     */
    createPolyline: function(coords, type, editable){

        var me = this,
            cableDescription = {
                fiberE2: {strokeColor: "#00000088", strokeWidth: 2},
                fiberE8: {strokeColor: "#00000088", strokeWidth: 4},
                fiberE12: {strokeColor: "#00000088", strokeWidth: 6}
            },
            polyline = new ymaps.Polyline(coords, {}, {
                strokeColor: cableDescription[type].strokeColor,
                strokeWidth: cableDescription[type].strokeWidth,
                editorMaxPoints: 999999,
                editorMenuManager: function (items, e) {
                    var coords = e.geometry.getCoordinates(),
                        box = Ext.Array.findBy(polyline.boxes, function(item){
                            if (item.index == e._index) return item.object;
                        });
                    items.push({
                        title: "Завершить редактирование",
                        onClick: function () {
                            polyline.editor.stopEditing();
                            me.container.fireEvent('objectModified', polyline, type)
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
                                var boxIdx = polyline.boxes.findIndex(function(item){
                                    return (item.object.getId() == box.object.getId())
                                });
                                if (boxIdx > -1) polyline.boxes.splice(boxIdx, 1);

                                var cableIdx = box.object.cables.findIndex(function(item){
                                    return (item.getId() == polyline.getId())
                                });
                                if (cableIdx > -1) box.object.cables.splice(cableIdx, 1);
                                debugger;

                            }
                        });
                    } else {
                        items.push({
                            title: "Установить муфту",
                            onClick: function (menu, item) {
                                var point = me.createPlacemark(coords, 'PON BOX');

                                polyline.boxes.push({object: point, index: e._index});
                                point.cables = [polyline];
                                me.container.fireEvent('objectModified', point, 'box');
                            }
                        },{
                            title: "Присоединить",
                            onClick: function () {

                                var closestBox = ymaps.geoQuery(me.ymap.geoObjects)
                                    .search('geometry.type == "Point"')
                                    .searchIntersect(me.ymap)
                                    .getClosestTo(coords);
                                if (closestBox) {
                                    closestBox.cables.push(polyline);
                                    polyline.geometry.set(e._index, closestBox.geometry.getCoordinates());
                                    polyline.boxes.push({object: closestBox, index: e._index});
                                }
                            }
                        });
                    }

                    return items;
                }
            });

        polyline.editor.events.add(['vertexadd', 'change'], function(){

        }, {polyline: polyline, self: this});

        // Custom properties/methods
        polyline.getId = this.getId;
        polyline.boxes = [];

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
            if (newCoords.length == oldCoords.length){
                polyline.boxes.forEach(function(point){
                    if (newCoords[point.index][0] != oldCoords[point.index][0] || newCoords[point.index][1] != oldCoords[point.index][1]) {
                        var coord = polyline.geometry.get(point.index);
                        point.object.setCoordinatesAll(coord, oldCoords[point.index]);
                    }

                });
            } else {
                polyline.boxes.forEach(function(point){
                    var index = newCoords.findIndex(function(lCoords){
                        var pCoords = point.object.geometry.getCoordinates();
                        return (pCoords[0] == lCoords[0] && pCoords[1] == lCoords[1])
                    });
                    point.index = index;
                });
            }


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
    createPlacemark: function(coords, caption) {
        var me = this,
            point = new ymaps.Placemark(coords, {
                iconContent: caption
            }, {
                preset: 'islands#blueStretchyIcon'
            });

        point.getId = this.getId;
        point.setCoordinatesAll = this.setCoordinatesAll;
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