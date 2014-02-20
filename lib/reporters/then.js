var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var ReporterStream = require('../ReporterStream');

function Then(resolved, rejected) {
  ReporterStream.call(this);
  this.on('request', this.request);
  this.on('responses', this.responses);
  this.resolved = resolved;
  this.rejected = rejected;
}

util.inherits(Then, ReporterStream);
Then.prototype.name = 'Then';

// just pass requests along
Then.prototype.request = function(item) {
  this.push(item);
};

// when upstream ends, we end too
Then.prototype.end = function() {
  this.push(null);
};

// call the promise-like callbacks
// when all responses have arrived
Then.prototype.responses = function(responses) {
  var succeeded = _.countBy(responses, {ok: true});
  var failed = responses.length - succeeded;
  if (failed === 0) {
    this.resolved(succeeded);
  } else {
    this.rejected(failed);
  }
};

module.exports = function(resolved, rejected) {
  return new Then(resolved, rejected);
};
