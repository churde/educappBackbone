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

            var model = new CurrentUser(_args);

            app.router.currentUserCollection.add(model);

            model.save();

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
            task.save();
        },
        areAllTasksAnswered: function() {
            var answeredTasks = app.router.taskListCollection.where({isAnswered: true});
            
            con("len de respondidas " + answeredTasks.length, "len de Collection " + app.router.taskListCollection.length, "para answeredTasks", answeredTasks)
            
            return answeredTasks.length === app.router.taskListCollection.length;
            
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



var CurrentUser = Backbone.Model.extend({
    idAttribute: '__userId',
    defaults: {
    }
});


var CurrentUserCollection = Backbone.Collection.extend({
    model: CurrentUser,
    localStorage: new Backbone.LocalStorage("currentUser"), 
    url: urlRoot
});


// Activity List
var Activity = Backbone.Model.extend({
    idAttribute: '__activityId',
    defaults: {
    }
});

var ActivityCollection = Backbone.Collection.extend({
    model: Activity,
    url: urlRoot + "get-activities",
});


var Task = Backbone.Model.extend({
    idAttribute: '__taskId',
    defaults: {
    }
});


var TaskCollection = Backbone.Collection.extend({
    model: Task,
    localStorage: new Backbone.LocalStorage("tasks")
});

var urlRest = "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/rest";

var Question = Backbone.Model.extend({
    idAttribute: '__questionOpenId',
    defaults: {
    }
});

var QuestionCollection = Backbone.Collection.extend({
    model: Question,
    localStorage: new Backbone.LocalStorage("questions"), 
    url: urlRest
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
