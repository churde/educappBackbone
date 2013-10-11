var ActivityListView = Backbone.View.extend({
    initialize: function() {

    },
    render: function() {
        var activities = this.collection.models;

        con("this.collection se compone de:", this.collection, "this.collection.models se compone de:", this.collection.models)

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
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

var ActivityCardView = Backbone.View.extend({
    initialize: function() {

        this.listenTo(this.model, "change", this.render);

    },
    render: function() {

        // Inside the $.get function 'this' refers to the jQuery object, not the ActivityCardView. So we need to store it in a differente variable (that)
        // in order to user it later. 

        var that = this;

        $.get("tpl/ActivityCardView.html", function(data) {
            var templateT = Handlebars.compile(data);

            //cargamos los datos
            var dataT = templateT(that.model.attributes);
            $(that.el).html(dataT);

        });
        
        return this;

    }
});

