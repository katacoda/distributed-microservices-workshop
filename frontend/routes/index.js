var express = require('express');
var router = express.Router();


var getCatalogue = require('./../lib/getCatalogue');
var allocateTicket = require('./../lib/allocateTicket');

var log = require('./lib/log');

router.get('/', log, function(req, res, next) {
  getCatalogue(function(err, catalogue) {
    if(err) { return next(err); }

    res.render('index', { title: 'Katacoda Amazing Ticketing Service', catalogue: catalogue });
  });
});

router.post('/tickets', function(req, res, next) {
  var userId = 1; //TODO: Fix :)
  allocateTicket({ticket: req.body.ticket, user: userId}, function(err, resp) {
    if(err) { return res.status(err.status).json(err.message); }

    res.json(resp);
  });
});

module.exports = router;
