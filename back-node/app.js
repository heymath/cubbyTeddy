
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
  , mongoose = require('mongoose');

;

var app = express();
/* Serveur express */

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

mongoose.connect('mongodb://hetic:domydomy83@kevinlarosa.fr:27017/domy', function(err){
    if (err) { throw err; }
});

//Schéma de ma collection Mongo || si elle n'existe pas elle se génére
var domySchema = new mongoose.Schema({
  sentiment : { type : Number },
  reveil : { type: Date},
  speak : { type: Array},
  name : {type: String}
});

var mongoModel = mongoose.model('domy',domySchema);


/*Patron de départ si aucune collection dans mongo */
global.domy = {
  name:"domy",
  sentiment:1888,
  speak:[
    {
     msg:'tu es nul',
     statut:0
    },
    {
      msg:"default",
      statut:0
    }
  ],
  reveil : new Date()
}


var query = mongoModel.find(null);
    query.where('name','domy');
    query.exec(function (err, domy) {
      if (err) { throw err; }
      if(domy.length == 0){
        console.log('Aucune info je crée la ressource');
        var domyModel = new mongoModel(global.domy);
        domyModel.save(function (err) {
          if (err) { throw err; }
        });
      }else{
        console.log('on utilise les infos de mongo');
        global.domy  = domy[0];
        console.log(global.domy)
      }
});



/* ROUTAGE  */
  
  /* GET & SET REVEIL */

  app.post('/reveil',function(req, res){
      console.log(req);
  });

  app.get('/reveil',function(req, res){
    var timestamp = global.domy.reveil.getTime();
    return res.send(timestamp.toString());
  });

  /* GET TALK */

  app.post('/domi',action.speak);

/* FIN DU ROUTAGE  */


http.createServer(app).listen(app.get('port'), function(){

  console.log('Express server listening on port ' + app.get('port'));

});
