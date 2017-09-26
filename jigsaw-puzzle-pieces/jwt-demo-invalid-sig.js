var fs = require('fs');
var jwt = require('jsonwebtoken');

var token = jwt.sign({ token: 'letmeaddevents' }, 'mysupersecretpassword');

// invalid token - synchronous
try {
  var decoded = jwt.verify(token, 'wrong-secret');
} catch(err) {
  // err
  console.log(err);
}

