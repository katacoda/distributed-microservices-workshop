app.use(function requestId(req, res, next) {
  console.log(req.headers);
  var id = req.headers['x-correlation'];

  if(id) {
    correlator.withId(id, function() {
      res.setHeader('X-Correlation', correlator.getId());
      next();
    });
  } else {
    correlator.withId(function() {
      res.setHeader('X-Correlation', correlator.getId());
      next();
    });
  }
});
