var discover = require('./service-discovery');
var request = require('./request');

module.exports = function(cb) {
  request.get("http://localhost:8080", cb);
};
