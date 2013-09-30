var TaskListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function(activityData) {

        var tasks = this.collection.models;

        $(this.el).html(this.template({activityData: activityData || {}}));

        for (var i = 0; i < tasks.length; i++) {
            $('.tasks', this.el).append(new TaskListItemView({model: tasks[i]}).render().el);
        }

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
        var questionsUserModels = taskUser.questions.model;
        var questionsUser = {};
        con("respuestas del usuario son ", questionsUser, "si intento recuperar el 121: ", app.router.activityUserModel.getTask(data.__taskId).questions.get('121'), 
    "toda la tarea ", task.questions);
        $(this.el).html(this.template({data: data}));

        return this;
    }
});