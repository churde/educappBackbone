app.taskListController = {
    initialize: function() {
        
        $('#actImg').on('click', function() {
            $('#showImgModal').modal('toggle');
        });

        $('#saveButtonInList').on('click', function() {
            $('#savingActivityModal').modal();
        });

        $('#savingActivityModalButton').on('click', function() {
            var send = app.activityController.saveActivity();
            if (send) {
                $('#savingActivityModal').modal('hide');
                $('#finishingActivityModal').modal();
                return;
            }
                $('#savingActivityModal').modal('hide');
        });

        $('#finishingActivityModalButton').on('click', function() {
            $('#finishingActivityModal').modal('hide');
            app.router.navigate('');
        });
    }
}
