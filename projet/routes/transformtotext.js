exports.transformToText = function(req, res){
	var _ = require('underscore')
	, util = require('util')
  , qs = require('qs')
  , fs = require('fs')
  , request = require('request')
  , ffmpeg = require('fluent-ffmpeg')
  ;

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
                    //console.log(JSON.parse(body))
                    console.log(JSON.parse(body));
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
};