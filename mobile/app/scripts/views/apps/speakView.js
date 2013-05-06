define(
    [
        'backbone',
        'vendor/BaseView',
        'text!templates/apps/speak.html'
    ],
    
    function(Backbone,BaseView,speakTemplate){
        
        var SpeakView = BaseView.extend({
            
            initialize: function(){
                
            },
            
            el: '#view',

            template: _.template(speakTemplate),

            events: {
                
            },
            
            render: function(){
                this.$el.empty();
                this.$el.append(this.template());
                return this;
            }
        });
        
        return SpeakView;
    }
);