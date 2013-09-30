app.taskController = {
    taskData: null,
    minimumDistance: 20,
    proximityDistance1: 50,
    proximityDistance2: 100,
    proximityDistance3: 200,
    currentLat: null,
    currentLong: null,
    currentDistance: null,
    currentAngle: null,
    currentHeading: 0,
    viewMode: 'normal',
    isInTarget: null,
    currentTaskIndex: null,
    tasksIndex: null,
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


        this.setTasksIndex();


        //DEV . Al llamar a las funciones de changeRadarView y changeTestMode los valores siguientes se cambiarán.
        this.changeView(this.viewMode);


    },
    setTasksIndex: function() {

        var tasks = app.router.activityModel.get('tasks');

        this.tasksIndex = [];

        for (var i = 0, l = tasks.length; i < l; i++) {
            this.tasksIndex[i] = {
                index: i,
                id: tasks[i].__taskId
            }

            if (tasks[i].__taskId === this.taskData.__taskId) {
                this.currentTaskIndex = i;
            }
        }
        this.updateTaskNavigation();
    },
    goToTask: function(task) {

        var taskIdToShow = false;

        switch (task) {
            case 'next':
                if (this.currentTaskIndex < this.tasksIndex.length - 1) {
                    this.currentTaskIndex++;
                    taskIdToShow = this.tasksIndex[this.currentTaskIndex].id;
                }
                break;

            case 'prev':
                if (this.currentTaskIndex > 0) {
                    this.currentTaskIndex--;
                    taskIdToShow = this.tasksIndex[this.currentTaskIndex].id;
                }
                break;
        }

        if (taskIdToShow) {
            app.router.navigate('/tasks/' + taskIdToShow);
        }
        
        this.updateTaskNavigation();

    },
    updateTaskNavigation: function() {
        

        $("#btnTaskPrev").attr("disabled", false);
        $("#btnTaskNext").attr("disabled", false);

        if (this.currentTaskIndex === 0) {
            $("#btnTaskPrev").attr("disabled", true);
        }
        if (this.currentTaskIndex === this.tasksIndex.length - 1) {
            $("#btnTaskNext").attr("disabled", true);
        }
    },
    goToTaskList: function() {
        app.router.navigate('/tasks');
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
    changeView: function(view) {

        this.viewMode = view;
        $(".btnView").attr("disabled", false);

        switch (this.viewMode) {
            case 'normal':
                $("#btnViewNormal").attr("disabled", true);
                break;

            case 'questions':
                $("#btnViewQuestions").attr("disabled", true);

                break;

            case 'radar':
                $("#btnViewRadar").attr("disabled", true);

                break;
        }

        this.showOverlay();

    },
    showOverlay: function(isShown) {


        if (this.viewMode === 'questions') {
            isShown = true;
        }
        if (this.viewMode === 'radar') {
            isShown = false;
        }


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
    saveTask: function(taskId) {

        var save = confirm("¿Guardar respuestas? Una vez guardadas volverás a la lista de tareas")

        if (save) {
            
            var aQuestions = [];
            
            $('.question .answer').each(function(index, element) {

                var element = $(element);

                var id = element.attr('id');
                var answer = element.val();

                aQuestions.push({
                    __questionOpenId: id,
                    answer: answer
                });
            });
        }

        app.router.activityUserModel.saveTask({
            __taskId: taskId,
            aQuestions: aQuestions
        });
        
        app.router.navigate('/tasks');

    },
    sendQuestionToServer: function() {
        
        // Check if all tasks were answered
        var allTasksAnswered = app.dataModel.tasks.areAllTasksAnswered();
        
        if(!allTasksAnswered){
            
            alert("Para enviar la actividad necesitas realizar TODAS las tareas");
            return;
            
        }
                
        var send = confirm("¿Enviar Actividad? Una vez enviada no podrás realizar ningún cambio.");

        if (send) {
            app.router.activityUserModel.sendToServer({
                success: function() {
                    Backbone.history.navigate("/activity", true);
                }
            });
        }

    }
}
