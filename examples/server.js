var http = require('http');
var pad  = require('pad');

function time() {
  var date = new Date();
  return pad(2, date.getHours(), '0') + ':'
       + pad(2, date.getMinutes(), '0') + ':'
       + pad(2, date.getSeconds(), '0') + '.'
       + pad(3, date.getMilliseconds(), '0');
}

function handler(req, res) {
  var delay = Math.floor(Math.random() * 500);
  console.log(time() + '  ' + req.url + '  (' + pad(3, delay, ' ') + 'ms)')
  setTimeout(function() {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('such server, many speeds');
    res.end();
  }, delay);
}

var server = http.createServer(handler);
server.listen(3000, function() {
  console.log('Started on port 3000');
});
