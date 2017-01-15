var discover = require('./service-discovery');
var request = require('./request');
var version = require('./../versions');

module.exports = function(cb) {
  discover('catalogue', version['catalogue'], function(err, service) {
    if(err) { return cb(err); }

    service.path = "/";
    request.get(service, cb);
  });
};
