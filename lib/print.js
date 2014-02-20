var util      = require('util');
var FLS       = require('freeloader-stream');

function Print() {
  FLS.call(this);
  this.on('request', this.request);
}

util.inherits(Print, FLS);
Print.prototype.name = 'Print';

// just print every request & response
Print.prototype.request = function(item) {
  console.log('Request ', item.request.options.url);
  item.response.then(function(res) {
    console.log('Response ', res.body);
  });
  this.push(item);
};

// when upstream ends
// we end too
Print.prototype.end = function() {
  this.push(null);
};

module.exports = function() {
  return new Print();
};
