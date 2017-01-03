var nats = require('nats');

var servers = ['nats://localhost:4222'];

module.exports = function(data, cb) {
  try {
    var client = nats.connect({servers: servers});
    client.on('error', function(e) {
      console.log('NATS Error', e);
      return cb(e);
    });

    client.publish('ticket-allocate', data, function() {
      client.close();
      return cb();
    });
  } catch (e) {
    console.log("Error", e);
    return cb(e);
  } 
};

