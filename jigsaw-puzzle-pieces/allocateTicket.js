var discover = require('./service-discovery');
var faultTolerantResolveTicketAllocator = require('./faultTolerantResolveTicketAllocator');

module.exports = function(data, cb) {
  discover('ticket-allocator', function(err, service) {
    if(err) { return cb(err); }

    faultTolerantResolveTicketAllocator(service, data, cb);
  });
};
