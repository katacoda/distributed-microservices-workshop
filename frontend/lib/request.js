var http = require('http');
var https = require('https');
var fs = require('fs');

var get = function(url, cb) {
  http.get(url, function(res) {
    var body = '';
    res.on("data", function(chunk) {
      body += chunk;
    });
    res.on("end", function() {
      try {
        var parsed = JSON.parse(body);
        cb(null, parsed);
      } catch (e) {
        cb(e);
      }
    });
  }).on('error', function(e) {
    cb(e);
  });
};

var secureGet = function(url, cb) {
  url.key = fs.readFileSync('certs/private-key.pem');
  url.cert = fs.readFileSync('certs/catalogue-cert.pem');
  url.ca = fs.readFileSync('certs/root-ca.cert.pem');
  url.hostname = url.host;

  https.get(url, function(res) {
    var body = '';
    res.on("data", function(chunk) {
      body += chunk;
    });
    res.on("end", function() {
      try {
        var parsed = JSON.parse(body);
        cb(null, parsed);
      } catch (e) {
        cb(e);
      }
    });
  }).on('error', function(e) {
    cb(e);
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
  get: get, post: post,
  secureGet: secureGet
};
