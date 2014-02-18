var util      = require('util');
var FLS       = require('freeloader-stream');

function Print() {
  FLS.call(this);
  this.on('request', this.onRequest);
}

util.inherits(Print, FLS);
Print.prototype.name = 'Print';

Print.prototype.onRequest = function(item) {
  console.log('Request ', item.request.options.url);
  item.response.then(function(res) {
    console.log('Response ', res.body);
  });
  this.push(item);
};

module.exports = function() {
  return new Print();
};
