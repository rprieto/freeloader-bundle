var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopTimer(duration) {
  FLS.call(this);
  var millis = ms(duration);
  setTimeout(function() {
    this.emit('terminate');
  }.bind(this), millis);
}

util.inherits(StopTimer, FLS);
StopTimer.prototype.name = 'StopTimer';

StopTimer.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  if (this.finished) return;
  this.push(chunk);
  callback();
};

module.exports = function(duration) {
  return new StopTimer(duration);
};
