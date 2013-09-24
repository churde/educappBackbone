var urlRoot;

var isDev = false;

if(isDev){
    urlRoot = "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/get-activities";
}
else{
    urlRoot = "http://www.appio.es/xurde/Zend/projects/educapp/pre/public/api/get-activities";
}


// Activity List



var Activity = Backbone.Model.extend({
    urlRoot: urlRoot, //"api/wines",
    idAttribute: '__activityId',
    
    defaults: {
        
    }
});

//alert("esto es model.js")
try {
    var ActivityCollection = Backbone.Collection.extend({
    model: Activity,
    url: urlRoot
});
} catch (e) {
    alert("error al declarar ActCollection")
    alert(e)
}




// Activity Card

//var ActivityCard = Backbone.Model.extend({
//    // param id is added as /:id
//    urlRoot: "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/get-activity/id", //"api/wines",
//    idAttribute: '__activityId',
//
//    defaults: {
//        __activityId: "",
//        description: ""
//    }
//});


var Task = Backbone.Model.extend({
    urlRoot: urlRoot, //"api/wines",
    idAttribute: '__taskId',
    
    defaults: {
        
    }
});


var TaskCollection = Backbone.Collection.extend({
    model: Task,
    url: urlRoot
});






















window.Wine = Backbone.Model.extend({
    urlRoot: "api/wines",

    initialize: function() {
        this.validators = {};

        this.validators.name = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.grapes = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a grape variety"};
        };

        this.validators.country = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
    },
    validateItem: function(key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },
    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function() {

        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    defaults: {
        id: null,
        name: "",
        grapes: "",
        country: "USA",
        region: "California",
        year: "",
        description: "",
        picture: null
    }
});

window.WineCollection = Backbone.Collection.extend({
    model: Wine,
    url: "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/backbone"//"api/wines"

});
