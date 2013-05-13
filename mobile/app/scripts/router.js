define(
    [
        'backbone',
        'views/headerView',
        'views/footerView',
        'views/home/homeView',
        'views/apps/configView'
    ],
    
    function(Backbone,HeaderView,FooterView,HomeView,ConfigView){
         
        var AppRouter = Backbone.Router.extend({
            
            app:{
                view : {}
            },

            routes:{
                '': 'home',
                'config': 'config'
            },

            home : function(){
                console.log("Routage vers la view home");
                homeView = new HomeView({router: this})
                this.app.view.headerView.hide_btn_back();
                homeView.render();
            },

            config : function(){
                console.log("Routage vers la view speak");
                configView = new ConfigView({router: this})
                configView.render();
                this.app.view.headerView.show_btn_back();
            }
        });
      
        initialize = function(){
            var app_router = new AppRouter;
            app_router.app.view.headerView = new HeaderView({router: this});
            app_router.app.view.headerView.render();
            app_router.app.view.footerView = new FooterView({router: this});
            app_router.app.view.footerView.render();
            Backbone.history.start();
        }
        
        return {
            initialize: initialize
        };
    }
);