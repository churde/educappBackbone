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
 
    }

        if (save) {
            app.router.activityUserModel.save({isCompleted: true}, {
                success: function() {
                    alert('Actividad CERRADA');
                    return true;
                }
            });
        } 
        return false;
    },
}

