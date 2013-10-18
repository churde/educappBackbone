app.taskListController = {
    initialize: function() {

        $('#saveButtonInList').on('click', function() {
            $('#savingActivityModal').modal();
        });

        $('#savingActivityModalButton').on('click', function() {
            var send = app.taskController.sendQuestionToServer();
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
