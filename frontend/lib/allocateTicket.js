var discover = require('./service-discovery');
var request = require('./request');
var debug = require('debug')('frontend:allocateTicket');
var retry = require('retry');

module.exports = function(data, cb) {
  discover('ticket-allocator', function(err, service) {
    if(err) { return cb(err); }

    faultTolerantResolve(service, data, cb);
  });
};

function faultTolerantResolve(service, data, cb) {
  var operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 500,
    maxTimeout: 2 * 1000,
    randomize: true,
  });

  operation.attempt(function(currentAttempt) {
    debug("Allocating Ticket - Attempt: " + currentAttempt);
    request.post(service, data, function(err, data) {
      if(err && err.status === 409) {
        // Ticket already allocated
        return cb(err);
      }

      if (err && operation.retry(err)) {
        debug("Ticket Allocation Request " + currentAttempt + " Failed. " + err.message);
        return;
      }

      cb(err ? operation.mainError() : null, data);
    });
  });
}
