var http = require('http');
var port = 4004;
var fs = require('fs');
var jwt = require('jsonwebtoken');
var saveEvent = require('./lib/saveEvent');


var requestHandler = function(req, res) {
  var token = req.headers['authorization'];
  if(token)
    token = token.replace(/^Bearer /, '');

  try {
    var decoded = jwt.verify(token, cert);
    console.log("Cert Token: ", token, decoded);
    if(decoded.token !== "letmeaddevents") {
      res.statusCode = 401;
      return res.end("Invalid Token");
    }
  } catch (e) {
    res.statusCode = 401;
    return res.end("Invalid Token");
  }

  if (req.method == 'POST') {
    console.log("[POST] Request Received");

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
var cert = fs.readFileSync('public.pem');

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
});
