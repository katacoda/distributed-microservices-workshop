var express = require('express');
var router = express.Router();

var getCatalogue = require('./../lib/getCatalogue');

router.get('/', function(req, res, next) {
  getCatalogue(function(err, catalogue) {
    if(err) { return next(err); }

    res.render('index', { title: 'Katacoda Amazing Ticketing Service', catalogue: catalogue });
  });
});

module.exports = router;
