var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function PerSecond(count) {
  FLS.call(this);
  this.on('request', this.request);
  this.on('shutdown', this.shutdown);
  this.intervals = [];
  this.period = 1000 / count;
}

util.inherits(PerSecond, FLS);
PerSecond.prototype.name = 'PerSecond';

PerSecond.prototype.request = function(item) {
  var intervalId = setInterval(function() {
    this.push(item.clone());
  }.bind(this), this.period);
  this.intervals.push(intervalId);
};

PerSecond.prototype.end = function() {
  // we don't care about the upstream ending
  // since we generate our own requests
};

PerSecond.prototype.shutdown = function() {
  this.intervals.forEach(clearInterval);
  this.push(null);
};

module.exports = function(count) {
  return new PerSecond(count);
};
