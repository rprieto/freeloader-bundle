var util      = require('util');
var FLS       = require('freeloader-stream');

function Print() {
  FLS.call(this);
}

util.inherits(Print, FLS);
Print.prototype.name = 'Print';

Print.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  console.log('Request ', chunk.request.options.url);
  chunk.response.then(function(res) {
    console.log('Response ', res.body);
  });
  this.push(chunk);
  callback();
};

module.exports = function() {
  return new Print();
};
