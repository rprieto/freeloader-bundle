var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Transform(fn) {
  FLS.call(this);
  this.fn = fn;
}

util.inherits(Transform, FLS);
Transform.prototype.name = 'Transform';

Transform.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);
  chunk.request = this.fn(_.cloneDeep(chunk.request));
  this.push(chunk);
  callback();
};

module.exports = function(fn) {
  return new Transform(fn);
};
