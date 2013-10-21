var TaskListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function(activityData) {

        var that = this;

        $.get("tpl/TaskListView.html", function(data) {
            var templateT = Handlebars.compile(data);

            //cargamos los datos
            var dataT = templateT(activityData);

            $(that.el).html(dataT);

            app.taskListController.initialize();
        });

        return this;
    }
});


var TaskView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        // it could be passed also as  this.template(this.model.toJson() )
        var data = this.model.attributes;
        
        //xxx habría que mejorar la manera de meter este dato aquí
        data.activityName = app.router.activityListCollection.get(data._activityId).attributes.name;
        
        var taskUser = app.router.activityUserModel.getTask(data.__taskId);

        var questionsUser = taskUser.get("questions");

        if (typeof questionsUser.models !== 'undefined') {
            var questionsUserModels = questionsUser.models;
            // Convert to json so it's indexed
            var questionsUser = {};
            for (var i = 0, l = questionsUserModels.length; i < l; i++) {
                questionsUser[questionsUserModels[i].id] = {
                    __questionId: questionsUserModels[i].get("__questionId"),
                    answer: questionsUserModels[i].get("answer")
                }
            }
        }
        
        var that = this;

        $.get("tpl/TaskView.html", function(dataG) {
            var templateT = Handlebars.compile(dataG);

            //cargamos los datos
            var dataT = templateT({data: data, questionsUser: questionsUser});
            con('datos de las tareas y de las respuestas realizadas',{data: data, questionsUser: questionsUser});
            $(that.el).html(dataT);
        });

        return this;
    }
});
