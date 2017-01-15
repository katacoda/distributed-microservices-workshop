var http = require('http');
var https = require('https');
var fs = require('fs');

var rest = require('rest');
var restInterceptor = require('zipkin-instrumentation-cujojs-rest').restInterceptor;
var tracer = require('./tracing');

var get = function(url, service, cb) {
  //QUESTION: What does the wrapping do? How does it work?
  var client = rest.wrap(restInterceptor, {tracer:tracer, remoteServiceName: service});

  client(url).then(success => {
    cb(null, JSON.parse(success.entity));
  }).catch(function () {
     cb()
  });
};

var post = function(url, data, cb) {
  var callback = function(response) {
    var status = response.statusCode;
    var body = ''
    response.on('data', function (chunk) {
      body += chunk;
    });

    response.on('end', function () {
      if(status > 300)
        cb({status: status, message: body});
      else
        cb(null, body);
    });
  }

  var req = http.request(url, callback);
  req.write(JSON.stringify(data));
  req.end();
};

module.exports = {
  get: get, post: post
};
