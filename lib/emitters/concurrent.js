var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function Concurrent(count) {
  FLS.call(this);
  this.on('request', this.request);
  this.on('pause', this.stopSending);
  process.on('SIGINT', this.stopSending.bind(this));  
  this.count = count;
}

util.inherits(Concurrent, FLS);
Concurrent.prototype.name = 'Concurrent';

// for each request coming in
// maintain X copies in-flight
Concurrent.prototype.request = function(item) {
  var stream = this;
  function resend() {
    if (stream.finished) return;
    var clone = item.clone();
    clone.response.then(resend);
    stream.push(clone);
  }
  _.times(this.count, resend);
};

// we don't care about the upstream ending
// since we generate our own requests
Concurrent.prototype.end = function() {
};

// if we receive a "pause" event
// stop sending
Concurrent.prototype.stopSending = function() {
  this.finished = true;
  this.push(null);
};

module.exports = function(count) {
  return new Concurrent(count);
};
