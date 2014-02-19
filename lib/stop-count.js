var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopCount(count) {
  FLS.call(this);
  this.on('request', this.request);
  this.responses = 0;
  this.count = count;
}

util.inherits(StopCount, FLS);
StopCount.prototype.name = 'StopCount';

StopCount.prototype.request = function(item) {
  ++this.responses;
  if (this.responses <= this.count) {
    // pass it on
    this.push(item);
  } else {
    // stop the whole pipeline
    this.terminate();
  }
};

// when upstream ends, we end too
StopCount.prototype.end = function() {
  this.push(null);
};

module.exports = function(count) {
  return new StopCount(count);
};
