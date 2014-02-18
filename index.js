var fs          =  require('fs');
var path        = require('path');
var changeCase  = require('change-case');

//
// Load all streams in lib as
// my-module  ->  streams.myModule
//

var files = fs.readdirSync(path.join(__dirname, 'lib'));
var streams = files.reduce(function(memo, filename) {
  var name = path.basename(filename, '.js');
  var fullPath = path.resolve(path.join(__dirname, 'lib', filename));
  var key = changeCase.camelCase(name);
  memo[key] = require(fullPath);
  return memo;
}, {});

//
// Helper to put all streams in global scope
//

streams.global = function() {
  Object.keys(streams).forEach(function(key) {
    global[key] = streams[key];
  });
};

module.exports = streams;
