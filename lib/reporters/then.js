var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Then(resolved, rejected) {
  FLS.call(this);
  this.on('request', this.request);
  this.resolved = resolved;
  this.rejected = rejected;
  this.promises = [];
}

util.inherits(Then, FLS);
Then.prototype.name = 'Then';

// collect all the promises
Then.prototype.request = function(item) {
  this.promises.push(item.response);
  this.push(item);
};

// call the promise-like callbacks
// when all responses have arrived
Then.prototype.end = function() {
  q.all(this.promises).then(function(responses) {
    var succeeded = _.countBy(responses, {ok: true});
    var failed = responses.length - succeeded;
    if (failed === 0) {
      this.resolved(succeeded);
    } else {
      this.rejected(failed);
    }
  }.bind(this)).done();
  this.push(null);
};

module.exports = function(resolved, rejected) {
  return new Then(resolved, rejected);
};
