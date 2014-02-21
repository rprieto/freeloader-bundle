var q         = require('q');
var util      = require('util');
var clc       = require('cli-color');
var FLS       = require('freeloader-stream');

var success = clc.green('o');
var failure = clc.red('x');

function ResponseDots() {
  FLS.call(this);
  this.on('request', this.request);
  console.log('');
}

util.inherits(ResponseDots, FLS);
ResponseDots.prototype.name = 'ResponseDots';

// for each response
// print a green o if successful or red x if not successful
ResponseDots.prototype.request = function(item) {
  item.response.then(function(res) {
    process.stdout.write(res.ok ? success : failure);
  }.bind(this)).done();
  this.push(item);
};

// when upstream ends
// we end too
ResponseDots.prototype.end = function() {
  this.push(null);
};

module.exports = function() {
  return new ResponseDots();
};
