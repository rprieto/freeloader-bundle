var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var ReporterStream = require('../ReporterStream');

function Callback(callback) {
  ReporterStream.call(this);
  this.on('request', this.request);
  this.on('responses', this.responses);
  this.callback = callback;
}

util.inherits(Callback, ReporterStream);
Callback.prototype.name = 'Callback';

// just pass along
Callback.prototype.request = function(item) {
  this.push(item);
};

// when upstream ends, we end too
Callback.prototype.end = function() {
  this.push(null);
};

// call the callback when all responses have arrived
Callback.prototype.responses = function(responses) {
  var succeeded = _.where(responses, {ok: true}).length;
  var failed = responses.length - succeeded;
  var message = 'Succeeded: ' + succeeded + ', failed: ' + failed;
  this.callback(failed > 0 ? new Error(message) : null);
};

module.exports = function(callback) {
  return new Callback(callback);
};
