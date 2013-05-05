 var formidable = require('formidable'),
      http = require('http'),
      util = require('util'),
      navcodec = require('navcodec')
  ;


  http.createServer(function(req, res) {

    // This if statement is here to catch form submissions, and initiate multipart form data parsing.

    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

      // Instantiate a new formidable form for processing.

      var form = new formidable.IncomingForm({ uploadDir: __dirname + '/uploaded' });

      // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

      form.parse(req, function(err, fields, files) {
        console.log(files);
        console.log(fields);
        if (err) {

          // Check for and handle any errors here.

          console.error(err.message);
          return;
        }
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');

        // This last line responds to the form submission with a list of the parsed data and files.

        res.end(util.inspect({fields: fields, files: files}));

        //je recupère le path 
        console.log(files["file"].path);

        navcodec.open(files["file"].path, function(err, media){
          console.log(media);
          if(media){

            media.addOutput(__dirname + '/fileconvert/'+files["file"].name+'.flac', {
              sampleRate:16000,
              channels:1,
              audioCodec:'flac'
            })

            media.transcode(function(err, progress, finished, time){
                console.log(progress);
                if(finished){
                  console.log('total transcoding time:'+time);
                }
            })
          }
        })
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