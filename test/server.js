var http = require('http');
var pad  = require('pad');

var responseCode = 200;

function handler(req, res) {
  var delay = Math.floor(Math.random() * 500);
  setTimeout(function() {
    res.writeHead(responseCode, {'content-type': 'text/plain'});
    res.write('such server, many speeds');
    res.end();
  }, delay);
}

var server = http.createServer(handler);

exports.setResponseCode = function(code) {
  responseCode = code;
};

exports.get = function() {
  return server;
}
