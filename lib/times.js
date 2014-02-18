var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Times(multiplier) {
  FLS.call(this);
  this.on('request', this.onRequest);
  this.multiplier = multiplier;
  this.inFlight = 0;
}

util.inherits(Times, FLS);
Times.prototype.name = 'Times';

Times.prototype.onRequest = function(item) {

  // how many "source" requests are in flight
  ++this.inFlight;

  // multiply!
  var promises = [];
  for (var i = 0; i < this.multiplier; ++i) {
    var clone = item.clone();
    promises.push(clone.response);
    this.push(clone);
  }

  // once this group has finished
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
