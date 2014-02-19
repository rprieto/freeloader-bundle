var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function AfterAll(callback) {
  FLS.call(this);
  this.on('request', this.request);
  this.callback = callback;
  this.promises = [];
}

util.inherits(AfterAll, FLS);
AfterAll.prototype.name = 'AfterAll';

// calculate the response time
AfterAll.prototype.request = function(item) {
  this.promises.push(item.response);
  this.push(item);
};

// call the callback when all responses have arrived
AfterAll.prototype.end = function() {
  q.all(this.promises).then(this.callback).done();
  this.push(null);
};

module.exports = function(callback) {
  return new AfterAll(callback);
};
