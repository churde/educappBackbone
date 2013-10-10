app.activityController = {
    initialize: function() {

        $('#locationField').tooltip({title: 'Lugar principal de realización de la actividad'});
        $('#enableDateField').tooltip({title: 'Fecha a partir de la cual se puede realizar la actividad'});
        $('#deliveryDateField').tooltip({title: 'Fecha a partir de la cual no se podrá realizar ni enviar la actividad'});
        $('#durationField').tooltip({title: 'Tiempo de duración de la actividad'});
        $('#difficultyField').tooltip({title: 'Nivel de complejidad de la actividad'});
        $('#creatorField').tooltip({title: 'Nombre del usuario que ha creado la actividad'});
        $('#stateField').tooltip({title: 'La actividad puede realizarse dentro de la fecha de entrega'});
        $('#tasksField').tooltip({title: 'Las tareas deben hacerse ordenadamente'});

        $('#startButton').on('click', function() {
            $('#startActivityModal').modal();
        });
        $('#startActivityModalButton').on('click', function() {
            $('#startActivityModal').modal('hide');
        });

    }

}

