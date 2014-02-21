var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

var MIN_TIMEOUT = 5; // millis

function PerSecond(count) {
  FLS.call(this);
  this.on('request', this.request);
  this.on('pause', this.clearTimer);
  process.on('SIGINT', this.clearTimer.bind(this));  
  this.intervals = [];
  this.period = 1000 / count;
  this.burst = this.period > MIN_TIMEOUT ? 1 : Math.floor(MIN_TIMEOUT / this.period);
}

util.inherits(PerSecond, FLS);
PerSecond.prototype.name = 'PerSecond';

// for each request coming in
// send out X per second
PerSecond.prototype.request = function(item) {
  var intervalId = setInterval(function() {
    for (var i = 0; i < this.burst; ++i) {
      this.push(item.clone());
    }
  }.bind(this), this.period);
  this.intervals.push(intervalId);
};

// we don't care about the upstream ending
// since we generate our own requests
PerSecond.prototype.end = function() {
};

// if we receive a "pause" event
// clear the timer and stop the stream
PerSecond.prototype.clearTimer = function() {
  this.intervals.forEach(clearInterval);
  this.push(null);
};

module.exports = function(count) {
  return new PerSecond(count);
};
