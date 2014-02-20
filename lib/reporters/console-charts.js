var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var babar     = require('babar');
var ReporterStream = require('../ReporterStream');

function ConsoleCharts() {
  ReporterStream.call(this);
  this.on('request', this.request);
  this.on('responses', this.draw);
  this.responseTimes = [];
}

util.inherits(ConsoleCharts, ReporterStream);
ConsoleCharts.prototype.name = 'ConsoleCharts';

// for each incoming request
// calculate the response time
ConsoleCharts.prototype.request = function(item) {
  var startTime = new Date();
  item.response.then(function(res) {
    this.responseTimes.push(new Date() - startTime);
  }.bind(this)).done();
  this.push(item);
};

// we the upstream ends
// we end too
ConsoleCharts.prototype.end = function() {
  this.push(null);
};

// draw some charts!
ConsoleCharts.prototype.draw = function(responses) {
  console.log('\n');
  this.timeDistribution();
};

ConsoleCharts.prototype.timeDistribution = function() {
  var xmin  = _.min(this.responseTimes);
  var xmax  = _.max(this.responseTimes);
  var xstep = (xmax - xmin) / 10;
  var chartmin = Math.max(xmin - xstep, 0);
  var chartmax = xmax + xstep;
  var series = [];
  for (var i = chartmin; i <= chartmax; i += xstep) {
    function inTime(x) {
      return x >= i && x < i + xstep;
    }
    series.push([
      i,
      this.responseTimes.filter(inTime).length
    ]);
  }
  var chart = babar(series, {color: 'green', yFractions: 0});
  console.log('Response time distribution\n');
  console.log(chart);
  console.log('\n');
};

module.exports = function() {
  return new ConsoleCharts();
};
