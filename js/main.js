var app = {};

Backbone.serverSync = Backbone.sync;


Backbone.Collection.prototype.destroyAll = function() {
    while (this.models.length > 0) {
        this.models[0].destroy();
    }
}
