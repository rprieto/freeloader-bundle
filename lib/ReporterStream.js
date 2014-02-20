var q    = require('q');
var util = require('util');
var FreeLoaderStream = require('freeloader-stream');

util.inherits(ReporterStream, FreeLoaderStream);

function ReporterStream() {
  FreeLoaderStream.call(this);
  this.promises = [];

  this.on('end', function() {
    q.all(this.promises).then(function(responses) {
      this.emit('responses', responses);
    }.bind(this)).done();
  });
}

ReporterStream.prototype.push = function(item) {
  FreeLoaderStream.prototype.push.call(this, item);
  if (item != null) {
    this.promises.push(item.response);
  }
}

module.exports = ReporterStream;
