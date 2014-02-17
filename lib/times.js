var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Times(multiplier) {
  FLS.call(this);
  this.multiplier = multiplier;
  this.inFlight = 0;
}

util.inherits(Times, FLS);
Times.prototype.name = 'Times';

Times.prototype._transform = function(chunk, encoding, callback) {
  FLS.prototype._transform.call(this);

  // TODO: this can be triggerd multiple times
  // with multiple requests (e.g. join())
  // so we should wait for all of them before calling push(null)

  var promises = [];
  ++this.inFlight;
  for (var i = 0; i < this.multiplier; ++i) {
    var clone = chunk.clone();
    promises.push(clone.response);
    this.push(clone);
  }
  q.all(promises).then(function() {
    --this.inFlight;
    if (this.inFlight === 0) {
      this.push(null);
    }
  }.bind(this)).done();
  
};

module.exports = function(multiplier) {
  return new Times(multiplier);
};
