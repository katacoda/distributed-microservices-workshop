var retry = require('retry');
var request = require('./request');
var debug = require('debug')('frontend:allocateTicket');

function faultTolerantResolve(service, data, cb) {
  //QUESTION: What happens if you change these settings?
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

      //QUESTION: How does this work?
      cb(err ? operation.mainError() : null, data);
    });
  });
}
