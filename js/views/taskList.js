var TaskListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var tasks = this.collection.models;
        
        $(this.el).html('<div class="tasks"></div>');
        
        for (var i = 0; i < tasks.length; i++) {
            $('.tasks', this.el).append(new TaskListItemView({model: tasks[i]}).render().el);
        }
        
//        $(this.el).append('<div class="row" id="buttonGroup"><div class="col-xs-6 col-md-6"><button type="button" class="btn btn-info btn-lg" onclick="app.router.back()"><span class="glyphicon glyphicon-chevron-left"></span> Volver</button></div></div>');
        
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