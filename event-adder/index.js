var http = require('http');
var port = 4004;
var eventStorage = require('./lib/nats');
var circuitBreaker = require('./lib/circuit-breaker');

var fs = require('fs');
var jwt = require('jsonwebtoken');

var breaker = new circuitBreaker({
  timeoutDuration: 1000,
  volumeThreshold: 1,
  errorThreshold: 50
});

var failedMessages = [];
var deadQueue = [];

breaker.onCircuitOpen = function(metrics) {
  console.warn('Circuit opened - Errors occurring', metrics);
};

breaker.onCircuitClose = function(metrics) {
  console.warn('Circuit closed - Errors stopped', metrics);
  console.warn('Replaying ' + failedMessages.length + ' lost messages...');
  for (var i = 0; i < failedMessages.length; i++) {
    var m = failedMessages[i];
    if(m.attempt > 5) {
      console.warn('Message going onto the dead-queue after five failed attempts');
      deadQueue.push(m);
    } else {
      saveReplyEvent(m.data, m.attempt);
    }
  }
};

var saveReplyEvent = function(data, attempt){
  var fallback = function(err) {
    failedMessages.push({data: data, attempt: attempt + 1});
    console.warn("Error", data, err);
  }

  var command = function(success, failure) {
    eventStorage(data, function(err) {
      if(err) { fallback(err); failure(); }

      success();
    });
  };

  breaker.run(command, fallback);
};

var saveEvent = function(data, res){
  // Breaker will shortcut to this when circuit is open
  // Persist message in a different way to replay later...
  var fallback = function(err) {
    failedMessages.push({data: data, attempt: 1});
    console.warn("Error", data, err);
    res.statusCode = 500;
    res.end(JSON.stringify(err));
  }

  var command = function(success, failure) {
    eventStorage(data, function(err) {
      if(err) { fallback(err); failure(); }

      res.end();
      success();
    });
  };

  breaker.run(command, fallback);
};




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
var cert = fs.readFileSync('public.pem');

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
});
