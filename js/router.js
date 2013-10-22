var AppRouter = Backbone.Router.extend({
    routes: {
        "": "activityList",
        "activity": "activityList",
        "activity/card/:id": "activityCard",
        "tasks": "taskList",
        "tasks/:id": "task",
        "login": "login"
    },
    modelsInitialized: null,
    before: function() {
        con("en before")
        if (this.modelsInitialized === null) {
            this.initModels();
        }
        // xxx En el template se pone el nombre del alumno llamando a loginController, pero debería pasarsele el parámetro desde aquí. Ver cómo se hace
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);

    },
    after: function() {

    },
    initialize: function() {
        try {
            con("en initialize del router")
            this.routesHit = 0;
            //keep count of number of routes handled by your application
            Backbone.history.on('route', function() {
                this.routesHit++;
            }, this);


        } catch (e) {
            con("error en el inicitalize de router", e)
            alert("error en el initialize de router ");
            alert(e)
        }

    },
    initModels: function() {
        // - - CURRENT USER
        // Current User Model
        this.currentUserModel = new CurrentUserModel();

        // Current User Collection
        this.currentUserCollection = new CurrentUserCollection();

        // Login View
        this.loginView = new LoginView({model: this.currentUserModel});

        this.currentUserCollection.fetch();

        // - - ACTIVITY
        // Activity List Collection        
        this.activityListCollection = new ActivityCollection();
        // Activity MODEL
        this.activityModel = new ActivityModel();

        // Activity List View
        this.activityListView = new ActivityListView({collection: this.activityListCollection});

        // Activity List Item View
        this.activityListItemView = new ActivityListItemView({model: this.activityModel});

        // ActivityCard VIEW
        this.activityCardView = new ActivityCardView({model: this.activityModel});

        // - - TASK
        // Task Collection
        this.taskListCollection = new TaskCollection();

        // Task Model
        this.taskModel = new TaskModel();

        // Task View
        this.taskListView = new TaskListView({collection: this.taskListCollection});

        // Task View
        this.taskView = new TaskView({model: this.taskModel});


        // USER DATA
        this.activityUserCollection = new ActivityUserCollection();
        this.activityUserCollection.fetch();
        
        this.modelsInitialized = true;
        
    },
    login: function() {
        $("#content").html(this.loginView.render().el);
    },
    /* Fetch activities from server. Each model contains all the info about an activity*/
    activityList: function() {        

        

        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }

        this.activityListCollection.fetch(
                {success: function() {
                
        // Add globalStatus to the models in the collection
        app.dataModel.activity.addStatusGlobalToModels();
                
                        $("#content").html(app.router.activityListView.render().el);
                    }}
        );
    },
    activityCard: function(id) {
        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }
        // Get the activity model from the collection, store it in this.activityModel and assign it to the view. This seems to be more
        // complicated that it should be
        this.activityModel = this.activityListCollection.get(id);
        this.activityCardView.model = this.activityModel;
        
        this.activityUserModel = this.activityUserCollection.getOrCreate(id);
        this.activityUserModel.save();

        var html = this.activityCardView.render().el;

//        window.setTimeout(function(){
             $("#content").html(html);
//        }, 1000)

       

    },
    taskList: function() {

        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }

        // get the tasks and add them as a collection to the taskListCollection
        var tasks = this.activityModel.get('tasks');
        // taskListCollection is set with the tasks of the current shown activity
        this.taskListCollection.reset(tasks);

        var activityData = this.activityModel.attributes;

        // Iterate over the tasks adding the isAnswered property for each one
        for (var i in activityData.tasks) {
            activityData.tasks[i].isAnswered = this.activityUserModel.getTask(activityData.tasks[i].__taskId).get('isAnswered');
        }

        con('activityData con isAnswered', activityData)

        // activityModel.attributes are passed to the view render function. That function will render task list elements (i.e. title and buttons) 
        // and it will iterate over the task to show each one with a different view
        $("#content").html(app.router.taskListView.render(activityData).el);

    },
    task: function(id) {
        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }


        this.taskModel = this.taskListCollection.get(id);
        this.taskView.model = this.taskModel;

        $("#content").html(this.taskView.render().el);

        // NOTE: This must be called after render
        app.taskController.init({taskData: this.taskModel.attributes});

    },
    ///////
    ///////
    back: function() {
        if (this.routesHit > 1) {
            //more than one route hit -> user did not land to current page directly
            window.history.back();
        } else {
            //otherwise go to the home page. Use replaceState if available so
            //the navigation doesn't create an extra history entry
            this.navigate('app/', {trigger: true, replace: true});
        }
    },
    navigate: function(url) {
        Backbone.history.navigate(url, true);
    },
    refresh: function() {
        this.activityList();
        this.navigate('', true);
    }
});

utils.loadTemplate(['HeaderView',
    'LoginView',
    'ActivityListItemView', 'ActivityCardView',
    'TaskListView', 'TaskView'], function() {
    

    app.router = new AppRouter();

    Backbone.history.start();
});
