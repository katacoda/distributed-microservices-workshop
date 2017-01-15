var breaker = require('./breaker');
var eventStorage = require('./nats');

var saveEvent = function(data, res){
  // Breaker will shortcut to this when circuit is open
  // Persist message in a different way to replay later...
  var omgItsGoneWrong = function(err) {
    breaker.storeFailedMessage({data: data, attempt: 1});
    console.warn("Save Event Error", data, err);
    res.statusCode = 500;
    res.end();
  }

  var command = function(success, failure) {
    eventStorage(data, function(err) {
      if(err) { omgItsGoneWrong(err); failure(); }

      res.end();
      success();
    });
  };

  breaker.run(command, omgItsGoneWrong);
};

module.exports = saveEvent;
