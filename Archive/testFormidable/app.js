 var formidable = require('formidable'),
      http = require('http'),
      util = require('util'),
      ffmpeg = require('fluent-ffmpeg'),
      needle = require('needle'),
      qs = require('qs'),
      fs = require('fs')
      request = require('request')
  ;


  http.createServer(function(req, res) {

    // This if statement is here to catch form submissions, and initiate multipart form data parsing.

    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

      // Instantiate a new formidable form for processing.

      var form = new formidable.IncomingForm({ uploadDir: __dirname + '/uploaded' });

      // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

      form.parse(req, function(err, fields, files) {
        if (err) {

          // Check for and handle any errors here.

          console.error(err.message);
          return;
        }
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');

        // This last line responds to the form submission with a list of the parsed data and files.

        res.end(util.inspect({fields: fields, files: files}));
        var file = __dirname + '/fileconvert/'+files["file"].name+'.flac';
        var proc = new ffmpeg({ source: files["file"].path })
          .withAudioChannels(1)
          .withAudioBitrate(42000)
          .saveToFile(file, function(stdout, stderr) {
            console.log('file has been converted succesfully');

            // Définition des paramètres
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

            fs.readFile(file, function (err, data) {
              if (err) console.error(err);
              request.post({body: data, headers: headers, url: url},function(err, res, body){
                if (err) console.error(err);
                try{
                  //console.log(JSON.parse(body))
                  console.log(JSON.parse(body));
                  //supprime les fichiers
                  fs.unlink(file);
                  fs.unlink(files["file"].path);
                }
                catch (e) {
                  console.log(e)
                }
              });

            });
          });
        })
      return;
  }
    // If this is a regular request, and not a form submission, then send the form.

    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  }).listen(8083);