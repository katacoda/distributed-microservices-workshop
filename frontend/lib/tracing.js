var zipkin = require('zipkin');
var HttpLogger = require('zipkin-transport-http').HttpLogger;
// In Node.js, the recommended context API to use is zipkin-context-cls.
var CLSContext = require('zipkin-context-cls');
var ctxImpl = new CLSContext(); // if you want to use CLS

var recorder = new zipkin.BatchRecorder({
  logger: new HttpLogger({
    endpoint: 'http://localhost:9411/api/v1/spans'
  })
});

var debug = new zipkin.ConsoleRecorder();

var tracer = new zipkin.Tracer({
  ctxImpl,
  recorder: recorder, // For easy debugging. You probably want to use an actual implementation, like Kafka or Scribe.
  traceId128Bit: true
});

module.exports = tracer;
