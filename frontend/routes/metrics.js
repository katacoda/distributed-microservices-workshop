var express = require('express');
var router = express.Router();
var metric = require('./../lib/metrics');

router.get('/metrics', function(req, res, next) {
  metric.hit(req, res);
  res.end(metric.summary());
});

module.exports = router;
