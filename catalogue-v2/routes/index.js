var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data = [{name: 'Oasis', tickets: [{price: '12.00', seat: 'A1'}, {price: '12.00', seat: 'A2', data: '01/02/2017 18:00:00'}]}];

  res.json(data);
});

module.exports = router;
