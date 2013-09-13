var AppRouter = Backbone.Router.extend({
    routes: {
        "": "activityList",
        "wines/page/:page": "list",
        "wines/add": "addWine",
        "wines/:id": "wineDetails",
        "about": "about",
        
        "activity": "activityList",
        "activity/card/:id" : "activityCard"
    }, 
    initialize: function() {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },
    activityList: function() {
        var activityList = new ActivityCollection();
        activityList.fetch({success: function() {
                $("#content").html(new ActivityListView({model: activityList}).el);
            }});
    },
            
            
    activityCard: function(id) {
        var activityCard = new ActivityCard({id: id});
        activityCard.fetch({success: function() {
                $("#content").html(new ActivityCardView({model: activityCard}).el);
            }});
//        this.headerView.selectMenuItem();
    },
            
            
            
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

utils.loadTemplate(['HeaderView', 'WineView', 'WineListItemView', 'AboutView', 
    'ActivityListItemView', 'ActivityCardView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});

function con(){
    try{        
        for(var i=0, l=arguments.length; i<l; i++){
            console.log(arguments[i])
        }        
    }
    catch(e){
    }  
}

function err(e){
    con("Error " + e.message + " en la linea " + e.lineNumber + " del archivo " + e.fileName)
}