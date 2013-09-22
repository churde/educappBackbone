var AppRouter = Backbone.Router.extend({
    routes: {
        "": "activityList",
        "activity": "activityList",
        "activity/card/:id": "activityCard",
        "tasks": "taskList",
        "tasks/:id": "task"


    },
    initialize: function() {
        try {
            
            alert("en initialize de router")
            
            this.routesHit = 0;
            //keep count of number of routes handled by your application
            Backbone.history.on('route', function() {
                this.routesHit++;
            }, this);

            this.headerView = new HeaderView();
            $('.header').html(this.headerView.el);
alert("despues del header")
            // Activity List Collection
            this.activityListCollection = new ActivityCollection();
alert("1")
            // Activity MODEL
            this.activityModel = new Activity();
alert("2")

            // Activity List View
            this.activityListView = new ActivityListView({collection: this.activityListCollection});
alert("3")

            // Activity List Item View
            this.activityListItemView = new ActivityListItemView({model: this.activityModel});
alert("4")


            // ActivityCard MODEL
//        this.activityCardModel = new ActivityCard(); // Not necessary, we use the ActivityModel

            // ActivityCard VIEW
            this.activityCardView = new ActivityCardView({model: this.activityModel});
alert("5")

            // Task Collection
            this.taskListCollection = new TaskCollection();
alert("6")

            // Task Model
            this.taskModel = new Task();

alert("7")
            // Task View
            this.taskListView = new TaskListView({collection: this.taskListCollection});
alert("8")

            // Task Item View
            this.taskListItemView = new TaskListItemView({model: this.taskModel});
alert("9")

            // Task View
            this.taskView = new TaskView({model: this.taskModel});
            
            alert("fin")
        } catch (e) {
            alert("error en el initialize de router "); alert(e)
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
    refresh: function() {
        this.activityList();
        this.navigate('', true);
    },
    activityList: function() {

        alert("router: activity list")
        try {
            this.activityListCollection.fetch(
                    {success: function() {
                            alert("success de traer datos del server, en act list")
                            $("#content").html(app.router.activityListView.render().el);
                        }}
            );
        } catch (e) {
            alert("error router act LIST" + e)
        }


    },
    activityCard: function(id) {
        // The change event in the model is triggered twice here: with .set('id', id) and then with .fetch
        // But the element is shown just when added to the #content
        this.activityModel = this.activityListCollection.get(id);
        this.activityCardView.model = this.activityModel;

        $("#content").html(this.activityCardView.render().el);

//        con("en activityCard he metido en activityModel: ", this.activityModel)

    },
    taskList: function() {

        // get the tasks and add them as a collection to the taskListCollection
        var tasks = this.activityModel.get('tasks');


//        con("en taskList tengo activityModel: ", this.activityModel, " con tareas ", tasks)

        this.taskListCollection.reset();
        // Add the tasks to the collection
        this.taskListCollection.add(tasks);

        $("#content").html(app.router.taskListView.render().el);

    },
    task: function(id) {
        // The change event in the model is triggered twice here: with .set('id', id) and then with .fetch
        // But the element is shown just when added to the #content
        this.taskModel = this.taskListCollection.get(id);
        this.taskView.model = this.taskModel;

        $("#content").html(this.taskView.render().el);

        con("desde router inicializo el taskController con taskData ", this.taskModel.attributes);

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

utils.loadTemplate(['HeaderView',
//    'WineView', 'WineListItemView', 'AboutView',
    'ActivityListItemView', 'ActivityCardView',
    'TaskListItemView', 'TaskView'], function() {
    app.router = new AppRouter();
    Backbone.history.start();
});
