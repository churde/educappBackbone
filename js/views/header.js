window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var name = app.dataModel.currentUser.get('name');
        //$(this.el).html(this.template());
        var that = this;

        $.get("tpl/HeaderView.html", function(data) {
            var templateT = Handlebars.compile(data);

            //cargamos los datos
            var dataT = templateT(name);
            $(that.el).html(dataT);

        });
        return this;
    }

});