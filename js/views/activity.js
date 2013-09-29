var ActivityListView = Backbone.View.extend({
    initialize: function() {
        this.render();

    },
    render: function() {
        try {
            var activities = this.collection.models;

            $(this.el).html('<div class="activities"></div>');
            
            
            alert("renderizando activity list con len " + activities.length)
            
            for (var i = 0; i < activities.length; i++) {
                $('.activities', this.el).append(new ActivityListItemView({model: activities[i]}).render().el);
            }

            return this;
        } catch (e) {
            alert("error render act list view. " + e)
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
            
            alert("en render de list item activity tengo model")
            alert(this.model);
            
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        } catch (e) {
            alert("error en render de act list ITEM view" + e)
        }
    }

});

var ActivityCardView = Backbone.View.extend({
    initialize: function() {

        this.listenTo(this.model, "change", this.render);

    },
    render: function() {

        // it could be passed also as  this.template(this.model.toJson() )
        $(this.el).html(this.template(this.model.attributes));
        return this;
    },
    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deleteWine",
        "drop #picture": "dropHandler"
    },
    change: function(event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },
    beforeSave: function() {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        // Upload picture file if a new file was dropped in the drop area
        if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
            utils.uploadFile(this.pictureFile,
                    function() {
                        self.saveWine();
                    }
            );
        } else {
            this.saveWine();
        }
        return false;
    },
    saveWine: function() {
        var self = this;
        this.model.save(null, {
            success: function(model) {
                self.render();
                app.router.navigate('wines/' + model.id, false);
                utils.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            },
            error: function() {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },
    deleteWine: function() {
        this.model.destroy({
            success: function() {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    dropHandler: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function() {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }
});

