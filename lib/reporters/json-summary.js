var _         = require('lodash');
var q         = require('q');
var fs        = require('fs');
var util      = require('util');
var Stats     = require('fast-stats').Stats;
var ReporterStream = require('../ReporterStream');

function JsonSummary(path) {
  ReporterStream.call(this);
  this.on('request', this.request);
  this.on('responses', this.printStats);
  this.path = path;
  this.responseTimes = [];
}

util.inherits(JsonSummary, ReporterStream);
JsonSummary.prototype.name = 'JsonSummary';

// for each incoming request
// calculate the response time
JsonSummary.prototype.request = function(item) {
  var startTime = new Date();
  item.response.then(function(res) {
    this.responseTimes.push(new Date() - startTime);
  }.bind(this)).done();
  this.push(item);
};

// we the upstream ends
// we end too
JsonSummary.prototype.end = function() {
  this.push(null);
};

// prints stats
JsonSummary.prototype.printStats = function(responses) {
  var stats = new Stats().push(this.responseTimes);
  var summary = {
    count: this.responseTimes.length,
    responseTimes: {
      min: _.min(this.responseTimes),
      max: _.max(this.responseTimes),
      mean: Math.floor(stats.amean()),
      median: Math.floor(stats.median()),
      percentiles: {
        75: stats.percentile(75),
        90: stats.percentile(90)
      }
    }
  };
  var str = JSON.stringify(summary, null, '\t');
  fs.writeFile(this.path, str, function (err) {
    if (err) {
      console.error('JsonSummary error: ', err);
    }
  });
};

module.exports = function(path) {
  return new JsonSummary(path);
};
