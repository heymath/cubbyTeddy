  var _ = require('underscore')
	, util = require('util')
  , qs = require('qs')
  , fs = require('fs')
  , request = require('request')
  , ffmpeg = require('fluent-ffmpeg')
  ,	exec=require('child_process').exec
  ;

	var app = {
		speak	:function(sentence){

		 	var fileTmpPath = 'tmp/speak';  
	  	  //console.log(req.query);
	  
		  var downloadfile = "http://translate.google.com/translate_tts?q="+sentence+"&tl=fr";
		  
		  var currentTime = new Date();
		  var realname = currentTime.getTime() + ".mp3";


		  var yumi = fs.createWriteStream(fileTmpPath+'/'+realname);
		  yumi.on('close', function() {
			 	console.log('lol');
		   		cmd = 'mpg321 '+fileTmpPath+'/'+realname;
		   		console.log(cmd);
		   		function puts(error, stdout, stderr) { console.log(stdout) }
		   		exec(cmd, puts);
		  });

		  reponse = request(downloadfile, function(error, response, buffer) {
		    //console.log(error)
		    // /console.log(response)
		  }).pipe(yumi);


		}
	}

  module.exports = app;