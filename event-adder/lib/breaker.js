var eventStorage = require('./nats');
var circuitBreaker = require('./circuit-breaker');

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
    var m = failedMessages.pop();
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
    breaker.storeFailedMessage({data: data, attempt: attempt + 1});
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

breaker.storeFailedMessage = function(message) {
  failedMessages.push(message);
}

breaker.storeDeadMessage = function(message) {
  deadQueue.push(message);
}

module.exports = breaker;
