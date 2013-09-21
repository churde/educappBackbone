app.taskController = {
    taskData: null,
    minimumDistance: 20,
    proximityDistance1: 50,
    proximityDistance2: 100,
    proximityDistance3: 20,
    currentLat: null,
    currentLong: null,
    currentDistance: null,
    currentAngle: null,
    currentHeading: 0,
    isInTarget: null,
    init: function(_args) {

        this.taskData = _args.taskData;

        app.geolocation.watchPosition({
            success: function(position) {

                app.taskController.updatePosition(position);
            },
            error: function(e) {
                alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
            },
            options: {}
        });

//        app.geolocation.watchHeading({
//            success: function(heading) {
//
//                app.taskController.updateHeading(heading);
//            },
//            error: function(e) {
//                alert('code: ' + error.code + '\n' +
//                        'message: ' + error.message + '\n');
//            },
//            options: {
//                frecuency: 10000
//            }
//        });
        try {
            navigator.camera.getPicture(
                    function(data) {
                        alert("success");
                    },
                    function(e) {
                        alert("error");
                    }
            );
        } catch (e) {
            alert(e)
        }



    },
    updatePosition: function(position) {


        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;

        var coords = {
            lat1: this.currentLat,
            long1: this.currentLong,
            lat2: this.taskData.latitude,
            long2: this.taskData.longitude
        };

        this.currentDistance = app.geolocation.calculateDistance(coords);

        this.currentAngle = app.geolocation.calculateAngle(coords);

        con("recibo en UPDATE de taskController position ", position, "tengo distance " + this.currentDistance,
                " y angulo " + this.currentAngle)

        this.updateRadar();
        this.updateProximityText();


    },
    updateHeading: function(heading) {

        this.currentHeading = heading.magneticHeading;
        alert("updating heading " + this.currentHeading)

        this.updateRadar();

    },
    updateRadar: function(_args) {

        var distanceIndicator = $(".distanceIndicator");
        distanceIndicator.html(this.currentDistance + " metros");

        var angle = this.currentHeading - this.currentAngle;

        var compassArrow = $(".compassArrow");
//        compassArrow.rotate(angle);
        compassArrow.css('transform', 'rotate(' + angle + 'deg)');
        compassArrow.css('-ms-transform', 'rotate(' + angle + 'deg)');
        compassArrow.css('-webkit-transform', 'rotate(' + angle + 'deg)');


    },
    updateProximityText: function(_args) {

        try {
            this.isInTarget = false;

            var taskData = this.taskData;
            var currentDistance = this.currentDistance;
            var notInProximityText = "Estás demasiado lejos de tu tarea";
            var text;


            if (currentDistance < this.minimumDistance) {
                text = taskData.geoTargetText;
                this.isInTarget = true;
            }
            else if (currentDistance < this.proximityDistance1) {
                text = taskData.geoProximityText1;
            }
            else if (currentDistance < this.proximityDistance2) {
                text = taskData.geoProximityText2;
            }
            else if (currentDistance < this.proximityDistance3) {
                text = taskData.geoProximityText3;
            }
            else {
                text = notInProximityText;
            }

            $('.proximityText').html(text);


            this.showOverlay(this.isInTarget);
        } catch (e) {
            alert(e)
        }




    },
    showOverlay: function(isShown) {
        if (isShown) {
            $('.questionsOverlay').show();
            $('.taskMainContainer').addClass('overlayBackground');
        }
        else {
            $('.questionsOverlay').hide();
            $('.taskMainContainer').removeClass('overlayBackground');
        }

    }
}
