var util      = require('util');
var ms        = require('ms');
var FLS       = require('freeloader-stream');

function StopCount(count) {
  FLS.call(this);
  this.on('request', this.onRequest);
  this.responses = 0;
  this.count = count;
}

util.inherits(StopCount, FLS);
StopCount.prototype.name = 'StopCount';

StopCount.prototype.onRequest = function(item) {
  ++this.responses;
  if (this.responses <= this.count) {
    this.push(item);
  } else {
    this.emit('terminate');
  };
  // item.response.then(function() {
  //   ++this.responses;
  //   if (this.responses === this.count && !this.stopping) {
  //     this.emit('terminate');
  //   }
    // else {
    //   callback();
    // }
  // }.bind(this)).done();
};

// StopCount.prototype.onRequest = function(item) {
//   this.push(item);
//   item.response.then(function() {
//     ++this.responses;
//     if (this.responses === this.count && !this.stopping) {
//       this.emit('terminate');
//     }
//     // else {
//     //   callback();
//     // }
//   }.bind(this)).done();
// };

module.exports = function(count) {
  return new StopCount(count);
};
