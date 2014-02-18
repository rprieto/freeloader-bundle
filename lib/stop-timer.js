var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopTimer(duration) {
  FLS.call(this);
  this.on('request', this.onRequest);
  var millis = ms(duration);
  setTimeout(function() {
    this.emit('terminate');
  }.bind(this), millis);
}

util.inherits(StopTimer, FLS);
StopTimer.prototype.name = 'StopTimer';


StopTimer.prototype.onRequest = function(item) {
  this.push(item);
};

module.exports = function(duration) {
  return new StopTimer(duration);
};
