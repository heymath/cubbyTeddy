define(
    [
        'backbone',
        'vendor/BaseView',
        'text!templates/home/home.html'
    ],
    
    function(Backbone,BaseView,homeTemplate){
        
        var HomeView = BaseView.extend({
            
            initialize: function(){
                
            },
            
            el: '#view',

            template: _.template(homeTemplate),

            events: {
                
            },
            
            render: function(){
                this.$el.append(this.template());
                return this;
            }
        });
        
        return HomeView;
    }
);