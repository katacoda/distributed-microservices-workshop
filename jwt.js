var fs = require('fs');
var jwt = require('jsonwebtoken');

var token = jwt.sign({ token: 'letmeaddevents' }, 'mysupersecretpassword');

var decoded = jwt.verify(token, 'mysupersecretpassword');
console.log("Decodable at https://jwt.io/#debugger");
console.log("Signed Token: ", token, decoded.token);

// invalid token - synchronous
try {
  var decoded = jwt.verify(token, 'wrong-secret');
} catch(err) {
  // err
  console.log(err);
}



var cert = fs.readFileSync('./event-adder/private.pem');
var token = jwt.sign({ token: 'letmeaddevents' }, cert, { algorithm: 'RS256'});

var cert = fs.readFileSync('./event-adder/public.pem'); 
var decoded = jwt.verify(token, cert);
console.log("Cert Token: ", token, decoded);

