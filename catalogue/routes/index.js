var express = require('express');
var router = express.Router();

var correlator = require('correlation-id');

var log = function(req, res, next) {
  console.log('[%s] [%s] Starting', new Date(), correlator.getId());

  res.on('end', function() {
    console.log('[%s] [%s] Completed', new Date(), correlator.getId());
  });
  next();
}

router.get('/', log, function(req, res, next) {
  var data = [{name: 'Oasis', tickets: [{price: '12.00', seat: 'A1'}, {price: '12.00', seat: 'A2'}]}];

  res.json(data);
});

module.exports = router;
