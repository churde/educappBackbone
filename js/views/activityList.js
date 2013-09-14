var ActivityListView = Backbone.View.extend({

    initialize: function () {
        this.render();
        
    },

    render: function () {

        var activities = this.collection.models;
        
        $(this.el).html('<div class="activities"></div>');
        
        for (var i = 0; i < activities.length; i++) {
            $('.activities', this.el).append(new ActivityListItemView({model: activities[i]}).render().el);
        }
        
        return this;
    }
});

var ActivityListItemView = Backbone.View.extend({

    tagName: "div",

    className: "activityRow",

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