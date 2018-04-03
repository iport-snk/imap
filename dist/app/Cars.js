Ext.define('IM.Cars', {
    updatePositions: function (positions) {
        var cars = Ext.getStore('Cars');

        positions.forEach( position => {
            var record = cars.findRecord('id', position.deviceId),
                car;

            if (record) {
                car = record.get('car');
                car.updatePosition(position);
            } else {
                car = this.createCarObject(position);
                cars.add({
                    id : position.deviceId,
                    car: car
                })
            }
        });
    },

    timer: function () {
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.options.set('iconGlyphColor', 'yellow');
            this.options.set('preset', 'islands#yellowGlyphCircleIcon')
        }, 30000);
    },

    updatePosition: function (position) {
        var color = position.attributes.motion ? 'green' : 'red';
        this.geometry.setCoordinates([position.latitude, position.longitude]);
        this.options.set('iconGlyph', 'plane');
        this.options.set('iconGlyphColor', color);
        this.options.set('preset', 'islands#' + color + 'GlyphCircleIcon');
        this.startTimer();
    },


    createCarObject: function (position) {
        var placeMark = new ymaps.Placemark();

        placeMark.updatePosition = this.updatePosition.bind(placeMark);
        placeMark.startTimer = this.timer.bind({
            options: placeMark.options,
            timerId: null
        });
        placeMark.options.set('zIndex', 900);
        placeMark.updatePosition(position);
        IM.provider.Map.ymap.geoObjects.add(placeMark);

        return placeMark;
    }
});