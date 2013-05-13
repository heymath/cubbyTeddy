define(
    [
        'backbone',
        'vendor/BaseView',
        'text!templates/apps/map.html'
    ],
    
    function(Backbone,BaseView,mapTemplate){
        
        var MapView = BaseView.extend({
            
            initialize: function(){
                
            },
            
            el: '#view',

            template: _.template(mapTemplate),

            events: {
                
            },
            
            render: function(){
                this.$el.empty();
                $('#view').addClass('no_padding');
                this.$el.append(this.template());
                return this;
            }
        });
        
        return MapView;
    }
);