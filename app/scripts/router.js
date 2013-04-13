define(
    [
        'backbone',
        'views/headerView',
        'views/home/homeView'
        
    ],
    
    function(Backbone,HeaderView,HomeView){
         
        var AppRouter = Backbone.Router.extend({
            
            app:{
              view : {}
            },
            routes:{
                '': 'home'
            },

            home : function(){
                console.log("Routage vers la view home");
                homeView = new HomeView({router: this})
                this.app.view.headerView.hide_btn_back();
                homeView.render();
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