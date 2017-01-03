var discover = require('./service-discovery');
var request = require('./request');

module.exports = function(data, cb) {
  discover('ticket-allocator', function(err, service) {
    if(err) { return cb(err); }

    request.post(service, data, cb);
  });
};
