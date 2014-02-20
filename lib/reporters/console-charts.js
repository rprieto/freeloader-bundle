var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var babar     = require('babar');
var ReporterStream = require('../ReporterStream');

function ConsoleCharts() {
  ReporterStream.call(this);
  this.on('request', this.request);
  this.on('responses', this.printStats);
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

// prints stats
ConsoleCharts.prototype.printStats = function(responses) {
  var series = [[0, 1], [1, 5], [2, 5], [3, 1], [4, 6]];
  var chart = babar(series, {color: 'green'});
  console.log('\n');
  console.log(chart); 
  console.log('\n');
};

module.exports = function() {
  return new ConsoleCharts();
};
