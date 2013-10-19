var isDev = true;
var urlRoot = isDev ? "http://www.appio.es/xurde/Zend/projects/educapp/dev/public/api/" : "http://www.appio.es/xurde/Zend/projects/educapp/pre/public/api/";



app.dataModel = {
    currentUser: {
        set: function(_args) {
            var model = new CurrentUserModel({
                name: _args.name,
                __userId: _args.id,
                isLogged: _args.isLogged
            });

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

            var answeredTasksLength = 0, taskUserCollection = app.router.activityUserModel.tasks;

            if (taskUserCollection.length > 0) {
                answeredTasksLength = taskUserCollection.where({'isAnswered': true}).length;
            }

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
    initialize: function() {
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
    idAttribute: '__questionId',
    defaults: {
    }
});

var QuestionUserCollection = Backbone.Collection.extend({
    model: QuestionUserModel,
    url: urlRest
});

var TaskUserModel = Backbone.Model.extend({
    idAttribute: '__taskId',
    initialize: function() {

        var questionsCollection = new QuestionUserCollection();
        questionsCollection.localStorage = new Backbone.LocalStorage("questionsUserTask_" + this.get("__taskId") + "_user_" + app.dataModel.currentUser.get("__userId"));

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
    },
    url: urlRest

});

/* IMPORTANTE: no entiendo por qué, en questions funciona bien si creo la colección de questiones como un atributo dentro del modelo de tareas: this.set("questions", questionsCollection)
 * y no funcionaba si se hacía como un parámetro directamente: this.questions = questionsCollection. Y para las tareas, es al revés :( 
 * 
 * Una diferencia importante parece ser (comprobar) es que al agregarlo como atributo se envía esta información al server. Tal como lo hacemos ahora, enviamos la collection
 * de tasks al servidor, las preguntas también se envían. Pero si intentamos enviar el modelo de activityUser no se envían las tasks (porque estas no están guardadas
 * como atributo del modelo sino con this.tasks). Lo óptimo sería enviar el modelo de la actividad, tiene más sentido, y le podríamos agregar info extra como el userId y
 * el activityId
 * */
var ActivityUserModel = Backbone.Model.extend({
    idAttribute: '__activityId',
    initialize: function() {
        this.tasks = new TaskUserCollection();

        this.tasks.localStorage = new Backbone.LocalStorage("tasksUserActivity_" + this.get("__activityId") + "_user_" + app.dataModel.currentUser.get("__userId"));
        this.tasks.parent = this;

        this.tasks.fetch();

    },
    saveTask: function(data) {

        var taskUserModel = new TaskUserModel({
            '__taskId': data.__taskId,
            'isAnswered': true,
            'userId': app.dataModel.currentUser.get("__userId"),
            'activityId': app.router.activityUserModel.get("__activityId")
        });
        // Save Questions
        taskUserModel.saveQuestions(data.aQuestions);
        // Save Task
        this.tasks.add(taskUserModel);
        taskUserModel.save();
        // Save this Activity
        this.save();
        this.tasks.fetch();
    },
    isTaskSaved: function(id) {
        var isSaved, task = this.tasks.get(id);

        if (typeof task === 'undefined') {
            isSaved = false;
        }
        else {
            isSaved = task.get("isAnswered");
        }

        return isSaved;
    },
    sendToServer: function(_args) {
        // Send to the server        
        Backbone.serverSync('update', this.tasks);

        if (_args.success) {
            _args.success();
        }
    },
    getTask: function(id) {
        return this.tasks.getOrCreate(id);
    },
    defaults: {
    }
});

var ActivityUserCollection = Backbone.Collection.extend({
    model: ActivityUserModel,
    initialize: function() {
        localStorage: new Backbone.LocalStorage("activityUser" + "_user_" + app.dataModel.currentUser.get("__userId"));
    },
    getOrCreate: function(id) {
        var model = this.get(id);
        if (!model) {
            model = new ActivityUserModel({'__activityId': id});
            this.add(model);
            model.save();
        }

        return model;
    },
            
    localStorage: new Backbone.LocalStorage("")
});







