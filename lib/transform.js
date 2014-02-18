var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Transform(fn) {
  FLS.call(this);
  this.on('request', this.onRequest);
  this.fn = fn;
}

util.inherits(Transform, FLS);
Transform.prototype.name = 'Transform';

Transform.prototype.onRequest = function(item) {
  item.request = this.fn(_.cloneDeep(item.request));
  this.push(item);
};

module.exports = function(fn) {
  return new Transform(fn);
};
