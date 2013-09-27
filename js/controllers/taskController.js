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
    testMode: null,
    showQuestions: null,
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
            options: {
                enableHighAccuracy: true
            }
        });

        app.geolocation.watchHeading({
            success: function(heading) {
                app.taskController.updateHeading(heading);
            },
            error: function(e) {
                alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
            },
            options: {
                frecuency: 20
            }
        });


        //DEV . Al llamar a las funciones de changeRadarView y changeTestMode los valores siguientes se cambiarán.
        this.testMode = false;
        this.showQuestions = false;

        this.changeTestMode();
        this.changeRadarView();


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

        this.updateRadar();
        this.updateProximityText();


    },
    updateHeading: function(heading) {

        this.currentHeading = heading.magneticHeading;
        this.updateRadar();

    },
    updateRadar: function(_args) {

        var angle = this.currentAngle - this.currentHeading;

        var distanceIndicator = $(".distanceIndicator");
        if (this.currentDistance !== null) {
            distanceIndicator.html(this.currentDistance + " metros");
        }
        else {
            distanceIndicator.html("Calculando distancia...");
        }

        var compassArrow = $(".compassArrow");

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
    changeTestMode: function() {
        this.testMode = !this.testMode;

        $("#testModeButton").html(this.testMode ? "Cambiar a modo NORMAL" : "Cambiar a modo TEST");

        if (this.testMode) {
            $("#changeRadarViewButton").show();
        }
        else {
            $("#changeRadarViewButton").hide();
        }


    },
    changeRadarView: function() {

        this.showQuestions = !this.showQuestions;

        $("#changeRadarViewButton").html(this.showQuestions ? "Modo test: Ver Radar" : "Modo Test: Ver Preguntas");

        this.showOverlay();
    },
    showOverlay: function(isShown) {

//xxx
        isShown = this.testMode ? this.showQuestions : isShown;
        if (isShown) {
            $('.questionsOverlay').show();
            $('.taskMainContainer').addClass('overlayBackground');
        }
        else {
            $('.questionsOverlay').hide();
            $('.taskMainContainer').removeClass('overlayBackground');
        }

    },
    // QUESTIONS
    saveQuestions: function(taskId) {
con("en saveQ con taskId " + taskId)
        var save = confirm("¿Guardar respuestas? Una vez guardadas volverás a la lista de tareas")

        if (save) {
            $('.question .answer').each(function(index, element) {

                var element = $(element);

                var id = element.attr('id');
                var answer = element.val();

                app.dataModel.questions.save({
                    data: {
                        __questionOpenId: id,
                        answer: answer,
                        userId: app.dataModel.currentUser.get('id')
                    },
                    success: function() {
                        
                        // Mark task as answered
                        app.dataModel.tasks.markAsAnswered(taskId)
                        
                        Backbone.history.navigate("/tasks", true);
                        
                    }

                });

            });
        }


//        this.sendQuestionToServer();

    },
    sendQuestionToServer: function() {
        var send = confirm("Solo deberías enviar la actividad una vez acabadas todas las tareas, pero de momento te dejamos igual ;)  \n\
Una vez enviada volverás al panel de actividades. ¿Enviar?");
        
        if(send){
            app.dataModel.questions.send({
                success: function(){
                    Backbone.history.navigate("/activity", true);
                }
            });
        }

    }
}
