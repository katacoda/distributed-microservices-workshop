var http = require('http');
var port = 4004;
var eventStorage = require('./lib/nats');


var saveEvent = function(data, res){
  eventStorage(data, function(err) {
    if(err) { res.statusCode = 500; res.end(JSON.stringify(err)); }

    res.end();
  });
};

var requestHandler = function(req, res) {
  if (req.method == 'POST') {
    console.log("[200] Request Received");

    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      saveEvent(body, res);
    });
  } else {
    console.log("[405] Request Received");
    res.statusCode = 405;
    res.end("Method not allowed");
  }
};

var server = http.createServer(requestHandler);

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
}); 
