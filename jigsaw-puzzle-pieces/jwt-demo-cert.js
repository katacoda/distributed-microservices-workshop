var fs = require('fs');
var jwt = require('jsonwebtoken');

var cert = fs.readFileSync('./event-adder/private.pem');
var token = jwt.sign({ token: 'letmeaddevents' }, cert, { algorithm: 'RS256'});

var cert = fs.readFileSync('./event-adder/public.pem'); 
var decoded = jwt.verify(token, cert);
console.log("Cert Token: ", token, decoded);

