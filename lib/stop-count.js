var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopCount(count) {
  FLS.call(this);
  this.responses = 0;
  this.count = count;
}

util.inherits(StopCount, FLS);
StopCount.prototype.name = 'StopCount';

StopCount.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  if (this.finished) return;
  this.push(chunk);
  chunk.response.then(function() {
    ++this.responses;
    if (this.responses === this.count && !this.stopping) {
      this.emit('terminate');
    } else {
      callback();
    }
  }.bind(this)).done();
};

module.exports = function(count) {
  return new StopCount(count);
};
