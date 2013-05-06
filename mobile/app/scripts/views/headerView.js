define(
    [
        'backbone',
        'vendor/BaseView'
    ],
    
    function(Backbone,BaseView){
        
        var HeaderView = BaseView.extend({
            
            initialize: function(){
                console.log(navigator.language);
            },
            
            el: '#main_container',
            
            events: {
            },
            
            render: function(){
                html = "<section id='header_container'>";
                    html += "<header id='header'>";
                        html += "<div>cubbyTeddy";
                            html += "<a href='#' style='display:none' id='back'><i class='icon-reply'></i><span class='spliter'><span></span></span></a>";
                        html += "</div>";
                    html += "</header>";
                html += "</section>";
                this.$el.append(html);
                return this;
            },
            
            show_btn_back: function(){
                $('#back').show();
            },
            
            hide_btn_back: function(){
                $('#back').hide();
            },
            
            change_route_btn: function(route){
                $('#back').attr('href',route);
            }
            
        });
        
        return HeaderView;
    }
);