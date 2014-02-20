var wrench      = require('wrench');
var path        = require('path');
var changeCase  = require('change-case');

//
// Load all streams in lib as
// my-module  ->  streams.myModule
//

var files = wrench.readdirSyncRecursive(path.join(__dirname, 'lib'));

var streams = files.reduce(function(memo, filepath) {
  if (filepath.match(/\.js$/)) {
    var name = path.basename(filepath, '.js');
    var fullpath = path.resolve(path.join(__dirname, 'lib', filepath));
    var key = changeCase.camelCase(name);
    memo[key] = require(fullpath);
  }
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
