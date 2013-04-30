require.config({
    paths: {
        jquery:     'vendor/jquery.min',
        lodash:     'vendor/lodash.min',
        backbone:   'vendor/backbone-min',
        text:       'vendor/text'
    },
    shim: {
        'backbone': {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(
    ["app"],
    function(App){
        App.initialize();
    }
);