var nats = require('nats');

var servers = ['nats://localhost:4222'];

module.exports = function(data, cb) {
  try {
    var client = nats.connect({servers: servers});
    client.on('error', function(e) {
      console.warn('NATS Error', e);
      setTimeout(function() {
        return cb(e);
      }, 2000);
    });

    client.publish('ticket-allocate', data, function() {
      client.close();
      return cb();
    });
  } catch (e) {
    console.warn("Error", e);
    return cb(e);
  }
};
