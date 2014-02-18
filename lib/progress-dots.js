var util      = require('util');
var FLS       = require('freeloader-stream');

function ProgressDots() {
  FLS.call(this);
  this.on('request', this.onRequest);
  console.log('');
}

util.inherits(ProgressDots, FLS);
ProgressDots.prototype.name = 'ProgressDots';

ProgressDots.prototype.onRequest = function(item) {
  process.stdout.write('.');
  this.push(item);
};

module.exports = function() {
  return new ProgressDots();
};
