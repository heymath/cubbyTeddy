
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
  , mongoose = require('mongoose')
  , geoip = require('geoip-lite')
  , fs = require('fs')
  , request = require('request')
  , exec=require('child_process').exec
  , Imap = require('imap')
  , inspect = require('util').inspect
  , cron = require('later').cronParser
  , later = require('later').later
  , text = require('later').enParser
  , recur = require('later').recur
  , Forecast = require('forecast.io')
  , util = require ('util')
  , log = require('log')
  ;

;
  
var statutGmail = false;

var options = {
    APIKey: "0e9e9faeff918cd7a893fe3f6c2419ce",
}
forecast = new Forecast(options);

var speak = function(sentence){
    console.log(sentence);
    var fileTmpPath = './tmp/speak';  
    //console.log(req.query);
    var downloadfile = "http://translate.google.com/translate_tts?q="+sentence+"&tl=fr";
    var currentTime = new Date();
    var realname = currentTime.getTime() + ".mp3";

    var yumi = fs.createWriteStream(fileTmpPath+'/'+realname);
    yumi.on('close', function() {
        cmd = 'mpg321 '+fileTmpPath+'/'+realname;
        function puts(error, stdout, stderr) { 
            console.log(stdout) 
            fs.unlinkSync(fileTmpPath+'/'+realname);
        }
        exec(cmd, puts);
    });

    reponse = request(downloadfile, function(error, response, buffer) {
        //console.log(error)
        // /console.log(response)
    }).pipe(yumi);
}

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
    name : {type: String},
    schedule : { type: Object},
    alarm : { type: Object}
});

var mongoModel = mongoose.model('domy',domySchema);

/*Patron de départ si aucune collection dans mongo */
global.domy = {
    name: "domy",
    sentiment: 1888,
    speak: [
        {
            msg: 'tu es nul',
            statut:0
        },
        {
            msg: 'default',
            statut:0
        }
    ],
    schedule: {
        weather: {
            statut:0
        }
    },
    reveil: new Date(),
    alarm: {
        email:null,
        mdp:null
    }
}

var query = mongoModel.find(null);
    query.where('name','domy');
    query.exec(function (err, domy){
        if(err) { throw err; }
        if(domy.length == 0){
            console.log('Aucune info je crée la ressource');
            var domyModel = new mongoModel(global.domy);
            domyModel.save(function(err){
                if(err){
                    throw err;
                }
            });
        } else{
            console.log('Récupèration mongo OK');
            global.domy  = domy[0];
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

    /* GET GEO */
    app.get('/geo',function(req, res){
        console.log(req.connection.remoteAddress);
    });

    /* GET STATUT IP */
    app.get('/statut',function(req, res){
        res.send(201,"ok");
    });

    /* GET GMAIL */
    app.get('/gmailStatut', function(req, res){
        var statut = req.query.statut;
        //console.log(req.query.statut)
        if(statut == 'true'){
            speak("Je surveille les mails !");
            statutGmail = statut;
        }else{
            //speak("Ok je m'en fiche de tes mails");
            statutGmail = statut;
        }
    });

    /* POST GMAIL */
    app.post('/gmail', function(req, res){
        var user = req.body.user,
            password = req.body.password,
            imap = new Imap({
                user: user,
                password: password,
                host: 'imap.gmail.com',
                port: 993,
                secure: true
            });

        var show = function(obj){
            return inspect(obj, false, Infinity);
        }
        var die = function(err){
            console.log('Uh oh: ' + err);
            process.exit(1);
        }
        var unseen = function(err, mailbox){
            if(err){
                res.send('Erreur lors de l\'ouverture de la boîte mail.');
                die(err);
            }
            var nbMessages = 0;
            imap.search([ 'UNSEEN', ['SINCE', 'April 1, 2004'] ], function(err, results){
                if(err){
                    res.send('Erreur lors de la recherche des messages non lus.');
                    die(err);
                }
                nbMessages = results.length;
            });
            imap.on('mail', function(nb){
                nbMessages += nb;
                if(statutGmail == 'true')
                  speak('Il y a '+nbMessages +' message non lu.');
            });
        }

        imap.connect(function(err){
            if(err){
                res.send(401, 'Erreur de connexion à la boîte mail.');
                die(err);
            }
            imap.openBox('INBOX', true, unseen);
        });
    });

/* FIN DU ROUTAGE  */



/* HORLOGE */
    var minutes = [];
    for (var i = 0; i<60; i++){
        minutes.push(i);
    }

    mSched = {
        schedules: [ 
            { h: [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 ] },
            { m: minutes }
        ]
    };

    actionDomi = function(){
    
        //condition a réalisé suivant arduino ou meteo


        //METEO
        forecast.get(48.8517799,2.4204908000000387, {"units":"si"},function (err, res, data) {
            if(err){
                throw err;
            }
            var temp = parseInt(data.currently.temperature);
            console.log(temp);
            if(temp >= -3 && temp <10){
                switch(domy.schedule.weather.statut){
                    case 0:
                        speak('Il fait vraiment froid dehors couvre toi bien !'+' il fait ' + temp + ' degrai');
                        domy.schedule.weather.statut++;
                    break;
                    case 1:
                        speak('Il fait vraiment froid dehors couvre toi bien !'+' il fait ' + temp + ' degrai');
                        domy.schedule.weather.statut++;
                    break;
                    case 2:
                        speak('Il fait vraiment froid dehors couvre toi bien !'+' il fait ' + temp + ' degrai');
                        domy.schedule.weather.statut=0;
                    break;
                }
            }
            console.log(domy.schedule.weather);

            if(temp >= 10 && temp <=19){
                switch(domy.schedule.weather.statut){
                    case 0:
                        speak('Il ne fait pas trop chaud ! Il fait ' + temp + ' degrai .');
                        domy.schedule.weather.statut++;
                    break;
                    case 1:
                        speak('Vivement une belle saison pour bronzé au soleil. car la il fait ' + temp + 'degrai .');
                        domy.schedule.weather.statut++;
                    break;
                    case 2:
                        speak("j'en ai marre du temps, il fait " + temp + 'degrai .');
                        domy.schedule.weather.statut=0;
                  break;
                }
            }

            if(temp > 20 && temp <30){
                switch(domy.schedule.weather.statut){
                    case 0:
                        speak('ENFIN ! il fait chaud profite pour sortir un peu, il fait' + temp + ' degrai .');
                        domy.schedule.weather.statut++;
                    break;
                    case 1:
                        speak('Et si on allait a la plage ? il fait ' + temp + ' degrai .');
                        domy.schedule.weather.statut++;
                    break;
                    case 2:
                        speak("Et si on prenait une glace avec cette température de " + temp + 'degrai .');
                        domy.schedule.weather.statut=0;
                    break;
                }
            }
        });
    }

    l = later(3600)
    l.exec(mSched, (new Date()), actionDomi);

/* FIN HORLOGE  */

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
