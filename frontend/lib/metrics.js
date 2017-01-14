var express = require('express');
var router = express.Router();

var client = require('prom-client');

var errorCount = new client.Gauge('request_errors', '# of failed requests');
errorCount.set(0);
var counter = new client.Counter('counter', 'metric_help');
var hit_counter = new client.Counter('frontend_http_requests', 'Number of page views', ['code', 'method']);

var counter = function() {
  counter.inc();
}

var error = function() {
  errorCount.inc();
}

var hit = function(req, res) {
  hit_counter.inc({method: req.method, code: res.statusCode });
}

var summary = function() {
  return client.register.metrics();
}

module.exports = {
  counter: counter,
  error: error,
  hit: hit,
  summary: summary
}
