var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopTimer(duration) {
  FLS.call(this);
  this.on('request', this.request);
  this.on('shutdown', this.shutdown);
  this.timeout = setTimeout(function() {
    this.terminate();
  }.bind(this), ms(duration));
}

util.inherits(StopTimer, FLS);
StopTimer.prototype.name = 'StopTimer';

// just pass incoming requests along
StopTimer.prototype.request = function(item) {
  this.push(item);
};

// when the upstream runs out of requests
StopTimer.prototype.end = function() {
  clearTimeout(this.timeout);
  this.push(null);
};

// when the pipeline closes
StopTimer.prototype.shutdown = function() {
  clearTimeout(this.timeout);
  this.push(null);
};

module.exports = function(duration) {
  return new StopTimer(duration);
};
