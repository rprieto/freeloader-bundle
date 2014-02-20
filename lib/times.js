var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Times(multiplier) {
  FLS.call(this);
  this.on('request', this.request);
  this.multiplier = multiplier;
}

util.inherits(Times, FLS);
Times.prototype.name = 'Times';

// for each incoming request
// send N clones
Times.prototype.request = function(item) {
  for (var i = 0; i < this.multiplier; ++i) {
    this.push(item.clone());
  }
};

// when upstream ends
// we end too
Times.prototype.end = function() {
  this.push(null);
};

module.exports = function(multiplier) {
  return new Times(multiplier);
};
