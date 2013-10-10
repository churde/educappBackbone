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

        // it could be passed also as this.template(this.model.toJson() )
        //$(this.el).html(this.template(this.model.attributes));

        //compile template
        //window.alert($('activityCardTemplate').html());
        var sourceTemplate = $("<p style='margin-top: 65px'>{{name}} - {{courseName}}</p>").html();
        con("vamos a ver la plantilla", sourceTemplate);
        var template = Handlebars.compile(sourceTemplate);

        //cargamos los datos
        var html = this.template(this.model.attributes);
        $(this.el).html(html);

        return this;
    }
});

