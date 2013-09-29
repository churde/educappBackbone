var alreadyLoaded;

Backbone.Router.prototype.before = function() {
};
Backbone.Router.prototype.after = function() {
};

Backbone.Router.prototype.route = function(route, name, callback) {
    if (!_.isRegExp(route))
        route = this._routeToRegExp(route);
    if (_.isFunction(name)) {
        callback = name;
        name = '';
    }
    if (!callback)
        callback = this[name];

    var router = this;

    Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);

        router.before.apply(router, arguments);
        callback && callback.apply(router, args);
        router.after.apply(router, arguments);

        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
    });
    return this;
};


var AppRouter = Backbone.Router.extend({
    routes: {
        "": "activityList",
        "activity": "activityList",
        "activity/card/:id": "activityCard",
        "tasks": "taskList",
        "tasks/:id": "task",
        "login": "login"


    },
    before: function() {

        // xxx En el template se pone el nombre del alumno llamando a loginController, pero debería pasarsele el parámetro desde aquí. Ver cómo se hace
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);

    },
    after: function() {

    },
    initialize: function() {
        try {
            
            if(alreadyLoaded){
                return;
            }
            
//alreadyLoaded = true;
            alert("en el initialize de router")
            this.routesHit = 0;
            //keep count of number of routes handled by your application
            Backbone.history.on('route', function() {
                this.routesHit++;
            }, this);



            // Activity List Collection
            this.activityListCollection = new ActivityCollection();

            // Activity MODEL
            this.activityModel = new Activity();

            // Activity List View
            this.activityListView = new ActivityListView({collection: this.activityListCollection});

            // Activity List Item View
            this.activityListItemView = new ActivityListItemView({model: this.activityModel});

            // ActivityCard VIEW
            this.activityCardView = new ActivityCardView({model: this.activityModel});

            // Task Collection
            this.taskListCollection = new TaskCollection();

            // Task Model
            this.taskModel = new Task();

            // Task View
            this.taskListView = new TaskListView({collection: this.taskListCollection});

            // Task Item View
            this.taskListItemView = new TaskListItemView({model: this.taskModel});

            // Task View
            this.taskView = new TaskView({model: this.taskModel});

            // Current User Model
            this.currentUserModel = new CurrentUser();

            // Current User Collection
            this.currentUserCollection = new CurrentUserCollection({model: this.currentUserModel});

            // Login View
            this.loginView = new LoginView({model: this.currentUserModel});


            // Questions
            this.questionModel = new Question();

            this.questionCollection = new QuestionCollection({model: this.questionModel});


            this.currentUserCollection.fetch();

        } catch (e) {
            alert("error en el initialize de router ");
            alert(e)
        }

    },
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
    },
    login: function() {
        $("#content").html(this.loginView.render().el);
    },
    activityList: function() {

        if (!app.dataModel.currentUser.isLogged()) {

            alert("ACT list: el usuario no está logeado, lo envío a login")
            this.navigate('/login');
//            return;
        }
        else {
            alert("ACT list, usuario logueado")
            this.activityListCollection.fetch(
                    {success: function() {
                            alert("success de get activities, llamo a render")
                            $("#content").html(app.router.activityListView.render().el);
                        }}
            );
        }


    },
    activityCard: function(id) {
        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }
        // The change event in the model is triggered twice here: with .set('id', id) and then with .fetch
        // But the element is shown just when added to the #content
        this.activityModel = this.activityListCollection.get(id);
        this.activityCardView.model = this.activityModel;

        $("#content").html(this.activityCardView.render().el);

    },
    taskList: function() {


        if (!app.dataModel.currentUser.isLogged()) {

            this.navigate('/login');
            return;
        }

        alert("el usuario sí está logeado, muestro actividades")
        // get the tasks and add them as a collection to the taskListCollection
        var tasks = this.activityModel.get('tasks');

        this.taskListCollection.reset(tasks);
        // Add the tasks to the collection
//        this.taskListCollection.add(tasks);

        $("#content").html(app.router.taskListView.render(this.activityModel.attributes).el);

    },
    task: function(id) {
        if (!app.dataModel.currentUser.isLogged()) {
            this.navigate('/login');
            return;
        }
        // The change event in the model is triggered twice here: with .set('id', id) and then with .fetch
        // But the element is shown just when added to the #content
        this.taskModel = this.taskListCollection.get(id);
        this.taskView.model = this.taskModel;

        $("#content").html(this.taskView.render().el);

        app.taskController.init({taskData: this.taskModel.attributes});
    },
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    ///////////////////
    list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({success: function() {
                $("#content").html(new WineListView({model: wineList, page: p}).el);
            }});
        this.headerView.selectMenuItem('home-menu');
    },
    wineDetails: function(id) {
        var wine = new Wine({id: id});
        wine.fetch({success: function() {
                $("#content").html(new WineView({model: wine}).el);
            }});
        this.headerView.selectMenuItem();
    },
    addWine: function() {
        var wine = new Wine();
        $('#content').html(new WineView({model: wine}).el);
        this.headerView.selectMenuItem('add-menu');
    },
    about: function() {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }
});

alert("esto es la raiz de router, desde donde se llama a loadTemaplates")

utils.loadTemplate(['HeaderView',
    'LoginView',
    'ActivityListItemView', 'ActivityCardView',
    'TaskListItemView', 'TaskListView', 'TaskView'], function() {

//    alert("despues de cargar las templates llamo a new AppRouter")
    app.router = new AppRouter();

    Backbone.history.start();
});
