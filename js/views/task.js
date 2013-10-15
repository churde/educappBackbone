var TaskListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function(activityData) {

        var that = this;

        $.get("tpl/TaskListItemView.html", function(data) {
            var templateT = Handlebars.compile(data);

            //cargamos los datos
            var dataT = templateT(activityData);

            $(that.el).html(dataT);

            app.taskListController.initialize();
        });

        /*var tasks = this.collection.models;
         
         $(this.el).html(this.template({activityData: activityData || {}}));
         
         for (var i = 0; i < tasks.length; i++) {
         $('.tasks', this.el).append(new TaskListItemView({model: tasks[i]}).render().el);
         }*/

        return this;
    }
});

var TaskListItemView = Backbone.View.extend({
    tagName: "div",
//    className: "taskContainer",
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function() {
        var data = this.model.toJSON();
        var isAnswered = app.router.activityUserModel.isTaskSaved(data.__taskId);

        // pass data
        $(this.el).html(this.template({data: data, isAnswered: isAnswered}));

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
        
        /*$(this.el).html(this.template({data: data, questionsUser: questionsUser}));*/

        return this;
    }
});