var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function PerSecond(count) {
  FLS.call(this);
  this.intervals = [];
  this.period = 1000 / count;
}

util.inherits(PerSecond, FLS);
PerSecond.prototype.name = 'PerSecond';

PerSecond.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  var intervalId = setInterval(function() {
    this.push(chunk.clone());
  }.bind(this), this.period);
  this.intervals.push(intervalId);
  callback();
};

PerSecond.prototype.end = function() {
  FLS.prototype.end.call(this);
  this.intervals.forEach(clearInterval);
};

module.exports = function(count) {
  return new PerSecond(count);
};
