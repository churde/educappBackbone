var LoginView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        // it could be passed also as  this.template(this.model.toJson() )
        $(this.el).html(this.template(this.model.attributes));
        return this;
    }
});



