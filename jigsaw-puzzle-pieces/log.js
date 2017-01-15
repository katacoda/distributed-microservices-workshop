var correlator = require('correlation-id');

//QUESTION: Where does correlator.getId store it's data?
//HINT: https://github.com/toboid/correlation-id

var log = function(req, res, next) {
  console.log('[%s] [%s] Starting', new Date(), correlator.getId());

  res.on('end', function() {
    console.log('[%s] [%s] Completed', new Date(), correlator.getId());
  });
  next();
}

module.export = log;
