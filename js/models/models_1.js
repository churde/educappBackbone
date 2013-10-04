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

            var model = new CurrentUserModel(_args);

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
        areAllTasksAnswered: function() {
            var answeredTasksLength = app.router.activityUserModel.tasks.length;

            con("len de aswer es " + answeredTasksLength + "  y len total es " + app.router.taskListCollection.length)

            return answeredTasksLength === app.router.taskListCollection.length;
        }
    }
}



var CurrentUserModel = Backbone.Model.extend({
    idAttribute: '__userId',
    defaults: {
    }
});

var CurrentUserCollection = Backbone.Collection.extend({
    model: CurrentUserModel,
    localStorage: new Backbone.LocalStorage("currentUser"),
    url: urlRoot
});

// Activity List
var ActivityModel = Backbone.Model.extend({
    idAttribute: '__activityId',
    initialize: function()
    {


    },
    defaults: {
    }
});

var ActivityCollection = Backbone.Collection.extend({
    model: ActivityModel,
    url: urlRoot + "get-activities",
});

var TaskModel = Backbone.Model.extend({
    idAttribute: '__taskId',
    defaults: {
    }
});

var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    localStorage: new Backbone.LocalStorage("tasks")
});

var urlRest = "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/rest";



// USER DATA
var QuestionUserModel = Backbone.Model.extend({
    idAttribute: '__questionOpenId',
    defaults: {
    }
});

var QuestionUserCollection = Backbone.Collection.extend({
    model: QuestionUserModel,
//    localStorage: new Backbone.LocalStorage("questionsUser"),
    url: urlRest
});

var TaskUserModel = Backbone.Model.extend({
    idAttribute: '__taskId',
    initialize: function() {

        var questionsCollection = new QuestionUserCollection();
        questionsCollection.localStorage = new Backbone.LocalStorage("questionsUserTask_" + this.get("__taskId"));

        questionsCollection.fetch();
        this.set("questions", questionsCollection);

    },
    saveQuestions: function(aQuestions) {

        for (var i = 0, l = aQuestions.length; i < l; i++) {
            var questionUserModel = new QuestionUserModel(aQuestions[i]);
            this.get("questions").add(questionUserModel);
            questionUserModel.save();
        }

    },
    getQuestion: function(id) {
        return this.get("questions").get(id);
    },
    defaults: {
        isAnswered: false
    }
});

var TaskUserCollection = Backbone.Collection.extend({
    model: TaskUserModel,
    getOrCreate: function(id) {
        var task = this.get(id);
        if (!task) {
            task = new TaskUserModel({'__taskId': id});
            this.add(task);
            task.save();

        }
        return task;
    }
});


var ActivityUserModel = Backbone.Model.extend({
    idAttribute: '__activityId',
    initialize: function() {
//        var tasksCollection = new TaskUserCollection();
//
//        tasksCollection.localStorage = new Backbone.LocalStorage("tasksUserActivity_" + this.get("__activityId"));
//
//        this.set("tasks", tasksCollection);




        

        this.set("tasks", new TaskUserCollection());

        this.get("tasks").localStorage = new Backbone.LocalStorage("tasksUserActivity_" + this.get("__activityId"));

        this.get("tasks").fetch();
        con("en initialize del activityUser model " + this.get("__activityId") + " donde he guardado tasks", this.get("tasks"))

    },
    saveTask: function(data) {

        var taskUserModel = new TaskUserModel({
            '__taskId': data.__taskId,
            'isAnswered': true
        });
        // Save Questions
        taskUserModel.saveQuestions(data.aQuestions);
        // Save Task
        this.get("tasks").add(taskUserModel);
        taskUserModel.save();
        // Save this Activity
        this.save();
//        this.tasks.fetch();


con("despues de guardar tarea tengo tasks ", this.get("tasks"))

    },
    isTaskSaved: function(id) {

        var isSaved, tasksCollection = this.get("tasks");
con("tasksCollection en isTaskSaved es ", tasksCollection)
        if (tasksCollection.length === 0) {
            isSaved = false;
        }
        else {
            
            var task = tasksCollection.get(id);
            
            if (typeof task === 'undefined') {
                isSaved = false;
            }
            else {
                isSaved = task.get("isAnswered");
            }

            return isSaved;
        }


    },
    sendToServer: function(_args) {
        // Send to the server
        this.fetch(); // Is it necessary??

        Backbone.serverSync('update', this);
        if (_args.success) {
            _args.success();
        }
    },
    getTask: function(id) {

//        var tasksCollection = this.get("tasks");
//        if(tasksCollection.length === 0){
//            con("llamo a initialize para recrear tasks")
//            this.initialize();
//        }

        return this.get("tasks").getOrCreate(id);
    },
    defaults: {
    }
});

var ActivityUserCollection = Backbone.Collection.extend({
    model: ActivityUserModel,
    getOrCreate: function(id) {
        var model = this.get(id);
        if (!model) {
            model = new ActivityUserModel({'__activityId': id});
            this.add(model);
            model.save();
        }

        return model;
    },
    localStorage: new Backbone.LocalStorage("activityUser"),
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
