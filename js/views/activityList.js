var ActivityListView = Backbone.View.extend({
    initialize: function() {
        this.render();

    },
    render: function() {
        try {
//            alert("render de activityList view")
            var activities = this.collection.models;

            $(this.el).html('<div class="activities"></div>');
//            alert("2")
            for (var i = 0; i < activities.length; i++) {
//                alert("for de actividades list con i " + i)
                $('.activities', this.el).append(new ActivityListItemView({model: activities[i]}).render().el);
            }

            return this;
        } catch (e) {
            alert("error render act list view" + e)
        }


    }
});

var ActivityListItemView = Backbone.View.extend({
    tagName: "div",
    className: "activityRow",
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function() {
        try {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        } catch (e) {
            alert("error en render de act list ITEM view" + e)
        }


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