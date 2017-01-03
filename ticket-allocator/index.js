var http = require('http');
var port = 4003;

var requestHandler = function(req, res) {
  if(Math.random() > 0.5) {
    if(Math.random() > 0.3) {
      return res.end(JSON.stringify({success: true}));
    } else {
      res.statusCode = 409;
      return res.end(JSON.stringify({success: false, message: "Already allocated"}));
    }
  } else {
    res.statusCode = 500;
    return res.end("Random Error");
  }
};

var server = http.createServer(requestHandler);

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
}); 
