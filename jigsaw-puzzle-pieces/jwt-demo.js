var fs = require('fs');
var jwt = require('jsonwebtoken');

var token = jwt.sign({ token: 'letmeaddevents' }, 'mysupersecretpassword');

var decoded = jwt.verify(token, 'mysupersecretpassword');
console.log("Decodable at https://jwt.io/#debugger");

console.log("");

console.log("Signed Token: ", token);

