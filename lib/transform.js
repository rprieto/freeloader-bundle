var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Transform(fn) {
  FLS.call(this);
  this.on('request', this.request);
  this.fn = fn;
}

util.inherits(Transform, FLS);
Transform.prototype.name = 'Transform';

// Apply the transformation
// to each request
Transform.prototype.request = function(item) {
  item.request = this.fn(_.cloneDeep(item.request));
  this.push(item);
};

// when upstream ends
// we end too
Transform.prototype.end = function() {
  this.push(null);
};

module.exports = function(fn) {
  return new Transform(fn);
};
