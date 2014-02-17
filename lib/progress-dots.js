var util      = require('util');
var FLS       = require('freeloader-stream');

function ProgressDots() {
  FLS.call(this);
  console.log('');
}

util.inherits(ProgressDots, FLS);
ProgressDots.prototype.name = 'ProgressDots';

ProgressDots.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  process.stdout.write('.');
  this.push(chunk);
  callback();
};

module.exports = function() {
  return new ProgressDots();
};
