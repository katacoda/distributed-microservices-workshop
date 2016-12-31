var http = require('http');

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

var post = function(url, data, cb) {
  http.post(url, data, function(res) {
    var body = '';
    res.on("data", function(chunk) {
      cb(null, chunk);
    });
  }).on('error', function(e) {
    cb(e);
  });

};

module.exports = {
  get: get, post: post
};
