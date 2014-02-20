var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopTimer(duration) {
  FLS.call(this);
  this.on('request', this.request);
  this.timeout = setTimeout(this.timer.bind(this), ms(duration));
}

util.inherits(StopTimer, FLS);
StopTimer.prototype.name = 'StopTimer';

// just pass incoming requests along
StopTimer.prototype.request = function(item) {
  this.push(item);
};

// when the upstream ends
// we end too
StopTimer.prototype.end = function() {
  this.push(null);
  clearTimeout(this.timeout);
};

// when the timer is up
// we stop sending requests
// and ask upstream to do the same
StopTimer.prototype.timer = function() {
  this.push(null);
  this.pause();
};


module.exports = function(duration) {
  return new StopTimer(duration);
};
