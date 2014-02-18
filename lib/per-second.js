var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function PerSecond(count) {
  FLS.call(this);
  this.on('request', this.onRequest);
  this.on('finish', this.onFinish);
  this.intervals = [];
  this.period = 1000 / count;
}

util.inherits(PerSecond, FLS);
PerSecond.prototype.name = 'PerSecond';

PerSecond.prototype.onRequest = function(item) {
  var intervalId = setInterval(function() {
    this.push(item.clone());
  }.bind(this), this.period);
  this.intervals.push(intervalId);
};

PerSecond.prototype.onFinish = function() {
  this.intervals.forEach(clearInterval);
};

module.exports = function(count) {
  return new PerSecond(count);
};
