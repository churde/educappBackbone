app.activityController = {
    initialize: function() {
        /*alert("Estoy en el initialize de activityController")*/
        $('#actImg').popover();
        $('#locationField').tooltip({title: 'Lugar principal de realización de la actividad'});
        $('#enableDateField').tooltip({title: 'Fecha a partir de la cual se puede realizar la actividad'});
        $('#deliveryDateField').tooltip({title: 'Fecha a partir de la cual no se podrá realizar ni enviar la actividad'});
        $('#durationField').tooltip({title: 'Tiempo de duración de la actividad'});
        $('#difficultyField').tooltip({title: 'Nivel de complejidad de la actividad'});
        $('#creatorField').tooltip({title: 'Nombre del usuario que ha creado la actividad'});
        $('#tasksField').tooltip({title: 'Las tareas deben hacerse ordenadamente'});

        $('#actImg').on('click', function() {
            $('#showImgModal').modal('toggle');
        });

        $('#statusField').on('click', function() {
            $('#pressStatusModal').modal();
        });

        $('#startActivityModalButton').on('click', function() {
            $('#pressStatusModal').modal('hide');
        });

        $('#startButtonOnBody').on('click', function() {
            $('#startActivityModal').modal();
        });

        $('#startActivityModalButtonDirect').on('click', function() {
            $('#startActivityModal').modal('hide');
        });

        $('#sendButtonOnBody').on('click', function() {
            $('#sendActivityModal').modal();
        });

        $('#sendActivityModalButtonDirect').on('click', function() {
            $('#sendActivityModal').modal('hide');
        });

        $('#sendActivityModalButton').on('click', function() {
            $('#pressStatusModal').modal('hide');
        });
    },
            
    saveActivity: function() {
        var ret;
        // Check if all tasks were answered
        var allTasksAnswered = app.dataModel.tasks.areAllTasksAnswered();

        if (!allTasksAnswered) {
            alert("Para guardar la actividad necesitas realizar TODAS las tareas");
            return false;
        }

        var save = confirm("¿Estás seguro de que quieres GUARDAR la actividad?");

        if (save) {
            app.router.activityUserModel.save({statusUser: 'done'}, {
                success: function() {
                    ret = true;
                }
            });
        }
        else{
            ret = false;
        }
            
        return ret;
    },
    
    sendActivityToServer: function() {
        var ret;
        // Check if all tasks were answered
        var allTasksAnswered = app.dataModel.tasks.areAllTasksAnswered();

        if (!allTasksAnswered) {
            alert("Para enviar la actividad necesitas realizar TODAS las tareas");
            return false;
        }

        var send = confirm("¿Estás seguro de que quieres ENVIAR la actividad?");

        if (send) {
            app.router.activityUserModel.sendToServer({
                success: function() {
                    /*Backbone.history.navigate("/activity", true);*/
                    alert("Actividad Enviada");
                    app.router.navigate('');
                    ret = true;
                }
            });
        }
        else{
            ret = false;
        }
            
        return ret;
    },
}

