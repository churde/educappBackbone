var TaskListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var tasks = this.collection.models;
//        con("en el render de task list con tasks", tasks)
        $(this.el).html('<div class="tasks"></div>');
        
        for (var i = 0; i < tasks.length; i++) {
//            con("llamo a la vista de item")
            $('.tasks', this.el).append(new TaskListItemView({model: tasks[i]}).render().el);
        }
        
        return this;
    }
});

var TaskListItemView = Backbone.View.extend({

    tagName: "div",

    className: "taskRow",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
con("esto es el render de task list item view con model.toJson", this.model.toJSON())
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});