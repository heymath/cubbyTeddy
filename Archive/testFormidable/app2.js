 var formidable = require('formidable'),
      http = require('http'),
      util = require('util'),
      ffmpeg = require('fluent-ffmpeg'),
      needle = require('needle'),
      speech = require('google-speech-api')
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

        /*var proc = new ffmpeg({ source: files["file"].path })
          .withAudioChannels(1)
          .withAudioBitrate(16000)
          .saveToFile(__dirname + '/fileconvert/'+files["file"].name+'.flac', function(stdout, stderr) {
            console.log('file has been converted succesfully');
            //je m'occupe de l'api google
            /*var options = {
              host: 'www.google.com',
              path: 'speech-api/v1/recognize?xjerr=1&client=chromium&pfilter=2&lang=fr-FR&maxresults',
              headers: {
                'Content-type': 'audio/x-flac; rate=16000',
              }
            }
            callback = function(response) {
              var str = ''
              response.on('data', function (chunk) {
                console.log(chunk);
                str += chunk;
              });

              response.on('end', function () {
                console.log(str);
              });
            }
            var req = http.request(options, callback);
            req.end();
            var data = {
              foo: 'bar',
              image: { file: __dirname + '/fileconvert/'+files["file"].name+'.flac', content_type: 'audio/x-flac; rate=16000' }
            }
            console.log(data);
            needle.post('http://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&pfilter=2&lang=fr-FR&maxresults', data, { multipart: true }, function(err, resp, body){
              //console.log(resp);
              //console.log(err);
              console.log(body);
            });
          });
        })*/
        var options = {
            file: __dirname+'/uploaded/bj.wav'
          , lang: 'fr-FR'
          , clipSize: 45
          , maxRequests: 20
        }

        speech(options, function (err, results) {
          if (err) return console.error(err);
          console.log(results);
        });
      return;
    });
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