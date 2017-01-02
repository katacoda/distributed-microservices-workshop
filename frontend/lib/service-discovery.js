var request = require('./request');

module.exports = function(name, version, cb) {
  var url = "http://localhost:8500/v1/health/service/";

  request.get(url + name + "?tags=" + version, function(err, data) {
    if(err) { return cb(err);}
    getFirstHealthService(data, cb);
  });
};

var getFirstHealthService = function(data, cb) {
  if(!data || data.length === 0) {
    return cb(new Error("No healthy services found"));
  }

  var service = data[0].Service;
  cb(null, { host: service.Address, port: service.Port});
};
