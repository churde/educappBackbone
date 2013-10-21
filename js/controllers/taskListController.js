app.taskListController = {
    initialize: function() {
        
        $('#actImg').on('click', function() {
            $('#showImgModal').modal('toggle');
        });

        $('#saveButtonInList').on('click', function() {
            $('#savingActivityModal').modal();
        });

        $('#savingActivityModalButton').on('click', function() {
            var save = app.activityController.saveActivity();
            if (save) {
                $('#savingActivityModal').modal('hide');
                $('#finishingActivityModal').modal('show');
            }
            else {
                $('#savingActivityModal').modal('hide');
            }
        });

        $('#finishingActivityModalButton').on('click', function() {
            $('#finishingActivityModal').modal('hide');
            app.router.navigate('');
        });
    }
}
