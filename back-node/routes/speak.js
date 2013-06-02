exports.speak = function(req, res){
  var _ = require('underscore')
	, util = require('util')
  , qs = require('qs')
  , fs = require('fs')
  , request = require('request')
  , ffmpeg = require('fluent-ffmpeg')
  ,	exec=require('child_process').exec
  ;


    var domy = global.domy;

    console.log(domy);

    nameFile = req.files["file"].path.split('/')[1];

    var fileTmp = './tmp/'+nameFile+'.flac';

    var proc = new ffmpeg({ source: req.files["file"].path })
    .withAudioChannels(1)
          .withAudioBitrate(42000)
          .saveToFile(fileTmp, function(stdout, stderr) {
            console.log('file has been converted succesfully');
              var params = {
                  client: 'chromium'
                , lang: 'fr-FR'
                , maxResults: 1
                , pfilter: 1
                , xjerr: 1
                , clipSize: 60
                , maxRequests: 4
                , sampleRate: 42000
              }
              var headers = {'content-type': 'audio/x-flac; rate=' + params.sampleRate}
              , url = 'https://www.google.com/speech-api/v1/recognize?' + qs.stringify(params);

              fs.readFile(fileTmp, function (err, data) {
              if (err) console.error(err);
                request.post({body: data, headers: headers, url: url},function(err, res, body){
                  if (err) console.error(err);
                  if (err) console.error(err);
                  try{
                    phrase = JSON.parse(body);
                    console.log(phrase.hypotheses[0].utterance);

                    switch (phrase.hypotheses[0].utterance){

                    	case "j\'aime les pâtes":
                    		console.log('Moi aussi kévin');
                    		speak("SUPER! moi aussi kevin".replace(/ /g,'%20'));
                    	break;

                    	case "Bonjour":
                    		speak("Bonjour Kévin. Comment vas tu ?".replace(/ /g,'%20'));
                    	break;

                    	case "allô":
							         speak("Non mais ALLO !..... TOM !".replace(/ /g,'%20'));
                    	break;

                    	case "quel est la météo aujourd'hui":
						            speak("Il va pleuvoir ! et il va faire 18 degrer. Tu devrais prendre un parapluie.".replace(/ /g,'%20'));
                    	break;

                    	case "allumé la cafetière":
                    		speak("C'est en cours".replace(/ /g,'%20'));
                    	break;

                      case domy.speak[0].msg:

                        switch(domy.speak[0].statut){

                          case 0:

                            speak("Non sait toi".replace(/ /g,'%20'));
                            domy.speak[0].statut++;
                          break;

                          case 1:

                            speak("Ne tente pas de me provoquer.".replace(/ /g,'%20'));
                            domy.speak[0].statut++;
                          break;

                          case 2:
                            speak("Si cela ne te plais pas demande le a quelqu’un d’autre!".replace(/ /g,'%20'));
                            domy.speak[0].statut=0;
                          break;

                        }
                      
                      break;

                    	default:
                        switch(domy.speak[1].statut){

                          case 0:
                            speak("Pardon, mais je ne comprends pas.".replace(/ /g,'%20'));
                            domy.speak[1].statut++;
                          break;

                          case 1:
                            speak("Je ne comprend toujours pas.".replace(/ /g,'%20'));
                            domy.speak[1].statut++;
                          break;

                          case 2:
                            speak("Ce n’est plus la peine de me parler, je boude.".replace(/ /g,'%20'));
                            domy.speak[1].statut=0;
                          break;
                        }
                    	break;
                    }
                    //console.log(JSON.parse(body));
                    //supprime les fichiers
                    fs.unlink(fileTmp);
                    fs.unlink(req.files["file"].path);
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.write('received upload:\n\n');
                  }
                  catch (e) {
                    console.log(e)
                  }                  
                });
              });
          });

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
};