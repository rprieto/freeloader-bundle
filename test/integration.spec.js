var fs = require('fs');
require('freeloader').global();
require('../index').global();

describe('Integration', function() {

  this.slow(10000);
  this.timeout(10000);

  before(function() {
    fs.mkdir('./tmp');
  });

  var r1 = request.get('http://localhost:3000/hello')
                  .header('Accept', 'application/json');

  var r2 = request.get('http://localhost:3000/world')
                  .header('Accept', 'application/json');


  it('can send a single request', function(done) {
    emit(r1)
    .pipe(progressDots())
    .pipe(consoleSummary())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can stop after X requests', function(done) {
    emit(r1)
    .pipe(perSecond(3))
    .pipe(times(5))
    .pipe(stopCount(13))
    .pipe(progressDots())
    .pipe(consoleSummary())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can join 2 requests', function(done) {
    join(emit(r1), emit(r2))
    .pipe(times(3))
    .pipe(progressDots())
    .pipe(consoleSummary())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can emit X requests per second', function(done) {
    emit(r1)
    .pipe(perSecond(5))
    .pipe(stopTimer('3s'))
    .pipe(progressDots())
    .pipe(consoleSummary())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can write a JSON summary to disk', function(done) {
    emit(r1)
    .pipe(times(5))
    .pipe(progressDots())
    .pipe(jsonSummary('./tmp/test-results.json'))
    .pipe(callback(done))
    .pipe(send());
  });

});
