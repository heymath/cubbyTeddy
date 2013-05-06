exports.texttospeak = function(req, res){

  var request = require('request')
    , fs = require("fs")
  ;

  var fileTmpPath = './tmp/speak';
  console.log(req.query);
  
  var downloadfile = "http://translate.google.com/translate_tts?q="+req.query['q']+"&tl="+req.query['tl'];
  
  var currentTime = new Date();
  var realname = currentTime.getTime() + ".mp3";

  request(downloadfile, function(error, response, buffer) {
    //console.log(error)
    // /console.log(response)
  }).pipe(fs.createWriteStream(fileTmpPath+'/'+realname));


  res.setHeader("Content-Type", "text/html");
  res.write(realname);
  res.end(); 
};