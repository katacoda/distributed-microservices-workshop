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
