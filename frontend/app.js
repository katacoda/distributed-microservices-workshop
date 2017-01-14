var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var metrics = require('./routes/metrics');

var zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
var tracer = require('./lib/tracing');
var correlator = require('correlation-id');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'frontend'
}));

app.use(function requestId(req, res, next) {
  var id = req.headers['x-correlation'];

  if(id) {
    correlator.withId(id, function() {
      res.setHeader('x-correlation', correlator.getId());
      next();
    });
  } else {
    correlator.withId(function() {
      res.setHeader('x-correlation', correlator.getId());
      next();
    });
  }
});

app.use('/', routes);
app.use('/', metrics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var data =  {
      message: err.message,
      error: err
    };
    console.log("Error", data);
    res.status(err.status || 500);
    res.render('error', data);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
