exports.transformToText = function(req, res){
	var _ = require('underscore');
	var formidable = require('formidable');
	util = require('util');
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
      });
};