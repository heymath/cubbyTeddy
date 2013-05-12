
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , speakToText = require('./routes/texttospeak')
  , textToSpeak = require('./routes/transformtotext')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')
  , _ = require('underscore')
  , action = require('./routes/speak')
  , blague = require('./lib/blague')
  , speak = require('./lib/speak.js')
  , async = require('async')

;

<<<<<<< HEAD
var lol = 'lollol';

=======
>>>>>>> e5c68860f1a8beaddc59f2065a444b01bec51284

var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./tmp'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/yumi',action.speak);

http.createServer(app).listen(app.get('port'), function(){

  console.log('Express server listening on port ' + app.get('port'));
<<<<<<< HEAD
  
    speak.speak("Alors que je lui raconte ma journée, mon fils de seize ans m'interrompt.");
    speak.speak("Aujourd'hui, nous prenons la voiture et mon mari conduit.");

});
=======
});
>>>>>>> e5c68860f1a8beaddc59f2065a444b01bec51284
