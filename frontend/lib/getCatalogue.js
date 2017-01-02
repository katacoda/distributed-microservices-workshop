var discover = require('./service-discovery');
var request = require('./request');

module.exports = function(cb) {
  discover('catalogue', function(err, service) {
    if(err) { return cb(err); }

    service.path = "/";
    request.get(service, cb);
  });
};
