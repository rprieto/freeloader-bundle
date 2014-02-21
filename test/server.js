var http = require('http');
var pad  = require('pad');

var responseCode = 200

function setResponseCode(code) {
  responseCode = code;
}

function handler(req, res) {
  var delay = Math.floor(Math.random() * 500);
  setTimeout(function() {
    res.writeHead(responseCode, {'content-type': 'text/plain'});
    res.write('such server, many speeds');
    res.end();
  }, delay);
}

var server = http.createServer(handler);

module.exports.get = function() {
  return server;
}
module.exports.setResponseCode = setResponseCode;

