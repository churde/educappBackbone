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
            $('#startActivityModal').modal('hide');
        });
        
        $('#startActivityModalButtonDirect').on('click', function() {
            $('#startActivityModal').modal('hide');
        });
        
        $('#startButtonOnBody').on('click', function() {
            $('#startActivityModal').modal();
        });
        
        $('#sendActivityModalButton').on('click', function() {
            $('#pressStatusModal').modal('hide');
        });
    },
    
    sendActivityToServer: function() {

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
                    return true;
                }
            });
            return true;
        }
        return false;
    },
    
    saveActivity: function() {
        
    },

}

