var urlRoot;

var isDev = true;

if (isDev) {
    urlRoot = "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/";
}
else {
    urlRoot = "http://www.appio.es/xurde/Zend/projects/educapp/pre/public/api/";
}


app.dataModel = {
    currentUser: {
        set: function(_args) {
alert("datamodel currentUser set 1")
            var model = new CurrentUser(_args);
alert("2")
            app.router.currentUserCollection.add(model);
alert("3")
            model.save();
alert("4")
        },
        get: function(attr) {

            var currentUser = app.router.currentUserCollection.findWhere({isLogged: true});

            return typeof currentUser !== 'undefined' ? currentUser.get(attr) : false;
        },
        isLogged: function() {
            return this.get("isLogged");
        },
        clear: function() {
            app.router.currentUserCollection.destroyAll();
        }
    },
    tasks: {
        markAsAnswered: function(taskId) {
            var task = app.router.taskListCollection.findWhere({__taskId: taskId.toString()});            
            task.set('isAnswered', true);  
        }
    },
    questions: {
        save: function(_args) {
            var model = new Question(_args.data);

            app.router.questionCollection.add(model);

            model.save();

            if (_args.success) {
                _args.success();
            }
        },
        send: function() {

            app.router.questionCollection.fetch();

            Backbone.serverSync('update', app.router.questionCollection);
        },
        isQuestionAnswered: function(questionId) {
            var question = app.router.questionCollection.findWhere({__questionOpenId: questionId});

            return typeof question !== "undefined";
        }
    }
}



// Activity List
var Activity = Backbone.Model.extend({
//    urlRoot: urlRoot + "get-activities", //"api/wines",
    idAttribute: '__activityId',
    defaults: {
    }
});

var ActivityCollection = Backbone.Collection.extend({
    model: Activity,
    url: urlRoot + "get-activities",
});


var Task = Backbone.Model.extend({
//    urlRoot: urlRoot, //"api/wines",
    idAttribute: '__taskId',
    defaults: {
    }
});


var TaskCollection = Backbone.Collection.extend({
    model: Task,
//    url: urlRoot
});

var CurrentUser = Backbone.Model.extend({
//    urlRoot: urlRoot,
//    idAttribute: '__userId',
    defaults: {
    }
});


var CurrentUserCollection = Backbone.Collection.extend({
    model: CurrentUser,
//    local: true,
//    remote: false
    localStorage: new Backbone.LocalStorage("currentUser"), //new Backbone.LocalStorage("CurrentUser")
    url: urlRoot
});

var urlRest = "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/rest";

var Question = Backbone.Model.extend({
    idAttribute: '__questionOpenId',
//    url: urlRest,
    defaults: {
    }
});

var QuestionCollection = Backbone.Collection.extend({
    model: Question,
//    local: true,
//    remote: false
    localStorage: new Backbone.LocalStorage("questions"), //new Backbone.LocalStorage("CurrentUser")
    url: urlRest// urlRoot + "save-questions"
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
