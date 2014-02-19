var util      = require('util');
var FLS       = require('freeloader-stream');

function ProgressDots() {
  FLS.call(this);
  this.on('request', this.request);
  console.log('');
}

util.inherits(ProgressDots, FLS);
ProgressDots.prototype.name = 'ProgressDots';

// for each incoming request
// print a dot
ProgressDots.prototype.request = function(item) {
  process.stdout.write('.');
  this.push(item);
};

// when upstream ends, we end too
ProgressDots.prototype.end = function() {
  this.push(null);
};

module.exports = function() {
  return new ProgressDots();
};
