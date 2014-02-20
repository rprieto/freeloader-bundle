var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLS       = require('freeloader-stream');

function ResponseTimeGraph() {
  FLS.call(this);
  this.on('request', this.request);
  // this.responses = [];
  // this.responseTimes = [];
}

util.inherits(ResponseTimeGraph, FLS);
ResponseTimeGraph.prototype.name = 'ResponseTimeGraph';

ResponseTimeGraph.prototype.request = function(item) {
  // var startTime = new Date();
  // this.responses.push(item.response);
  // item.response.then(function(res) {
  //   this.responseTimes.push(new Date() - startTime);
  // }.bind(this)).done();
  // this.push(item);
};

ResponseTimeGraph.prototype.end = function() {
  // q.all(this.responses).then(function() {
  // }.bind(this)).done();
};

module.exports = function() {
  return new ResponseTimeGraph();
};





// var fs = require('fs'),
//     highcharts = require('node-highcharts'),
//     options = {
//         chart: {
//             width: 300,
//             height: 300,
//             defaultSeriesType: 'bar'
//         },
//         legend: {
//             enabled: false
//         },
//         title: {
//             text: 'Highcharts rendered by Node!'
//         },
//         series: [{
//             data: [ 1, 2, 3, 4, 5, 6 ]
//         }]
//     };

// highcharts.render(options, function(err, data) {
//     if (err) {
//         console.log('Error: ' + err);
//     } else {
//         fs.writeFile('chart.png', data, function() {
//             console.log('Written to chart.png');
//         });
//     }
// });