window.ActivityListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var activities = this.model.models;
        
        con("recibo activities", activities); 
        
        $(this.el).html('<div class="activities"></div>');
        
        for (var i = 0; i < activities.length; i++) {
            $('.activities', this.el).append(new ActivityListItemView({model: activities[i]}).render().el);
        }
        
        return this;

        var wines = this.model.models;
        var len = wines.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new WineListItemView({model: wines[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.ActivityListItemView = Backbone.View.extend({

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