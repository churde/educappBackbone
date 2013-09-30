var TaskListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function (activityData) {

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

    className: "taskContainer",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

var TaskView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        // it could be passed also as  this.template(this.model.toJson() )
        $(this.el).html(this.template(this.model.attributes));
        
        
        
        return this;
    }
});