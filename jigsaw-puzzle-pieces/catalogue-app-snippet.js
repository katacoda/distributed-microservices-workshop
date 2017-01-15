app.use(zipkinMiddleware({
  tracer,
  serviceName: 'catalogue'
}));

app.use(function(req, res, next) {
  console.log("Incoming Request Headers", req.headers);
  next();
});
