var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Callback(callback) {
  FLS.call(this);
  this.on('request', this.request);
  this.callback = callback;
  this.promises = [];
}

util.inherits(Callback, FLS);
Callback.prototype.name = 'Callback';

// collect all the promises
Callback.prototype.request = function(item) {
  this.promises.push(item.response);
  this.push(item);
};

// call the callback when all responses have arrived
Callback.prototype.end = function() {
  q.all(this.promises).then(function(responses) {
    var succeeded = _.where(responses, {ok: true}).length;
    var failed = responses.length - succeeded;
    var message = 'Succeeded: ' + succeeded + ', failed: ' + failed;
    this.callback(failed > 0 ? new Error(message) : null);
  }.bind(this)).done();
  this.push(null);
};

module.exports = function(callback) {
  return new Callback(callback);
};
