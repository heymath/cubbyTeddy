define(
    [
        'backbone',
        'views/headerView',
        'views/home/homeView',
        'views/apps/speakView'
    ],
    
    function(Backbone,HeaderView,HomeView,SpeakView){
         
        var AppRouter = Backbone.Router.extend({
            
            app:{
                view : {}
            },

            routes:{
                '': 'home',
                'speak': 'speak'
            },

            home : function(){
                console.log("Routage vers la view home");
                homeView = new HomeView({router: this})
                this.app.view.headerView.hide_btn_back();
                homeView.render();
            },

            speak : function(){
                console.log("Routage vers la view speak");
                speakView = new SpeakView({router: this})
                speakView.render();
                this.app.view.headerView.show_btn_back();
            }
        });
      
        initialize = function(){
            var app_router = new AppRouter;
            app_router.app.view.headerView = new HeaderView({router: this});
            app_router.app.view.headerView.render();
            Backbone.history.start();
        }
        
        return {
            initialize: initialize
        };
    }
);