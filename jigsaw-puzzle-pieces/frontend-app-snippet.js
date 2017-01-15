app.use(zipkinMiddleware({
  tracer,
  serviceName: 'frontend'
}));
