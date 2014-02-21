var util      = require('util');
var FLS       = require('freeloader-stream');

function PeriodicSnapshot(millis) {
  FLS.call(this);
  this.on('request', this.request);
  this.on('pause', this.onPause);
  this.requests = 0;
  this.responses = 0;
  this.delta = 0;
  this.interval = setInterval(this.print.bind(this), millis);
}

util.inherits(PeriodicSnapshot, FLS);
PeriodicSnapshot.prototype.name = 'PeriodicSnapshot';

// count each incoming request
// and monitor their response
PeriodicSnapshot.prototype.request = function(item) {
  ++this.requests;
  ++this.delta;
  item.response.then(function() {
    ++this.responses;
  }.bind(this)).done();
  this.push(item);
};

// when upstream ends
// we end too
PeriodicSnapshot.prototype.end = function() {
  clearInterval(this.interval);
  this.push(null);
};

// stop our timer
PeriodicSnapshot.prototype.onPause = function() {
  clearInterval(this.interval);
  this.push(null);
};

PeriodicSnapshot.prototype.print = function() {
  console.log('Snapshot')
  console.log('  Total: ' + this.requests);
  console.log('  Delta: ' + this.delta);
  console.log('  In flight: ' + (this.requests - this.responses));
  this.delta = 0;
};

module.exports = function(millis) {
  return new PeriodicSnapshot(millis);
};
