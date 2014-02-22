var fs = require('fs');
var server = require('./server');
require('freeloader').global();
require('../index').global();

describe('Integration', function() {

  this.slow(10000);
  this.timeout(10000);

  before(function(done) {
    fs.mkdir('./tmp', function() {});
    server.get().listen(3000, done)
  });

  after(function() {
    server.get().close();
  });

  beforeEach(function() {
    server.setResponseCode(200);
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

  it('can maintain X concurrent requests', function(done) {
    emit(r1)
    .pipe(concurrent(5))
    .pipe(stopCount('30'))
    .pipe(progressDots())
    .pipe(responseDots())
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

  it('can print console charts', function(done) {
    emit(r1)
    .pipe(perSecond(20))
    .pipe(stopCount(50))
    .pipe(progressDots())
    .pipe(consoleCharts())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can print successful response dots', function(done) {
    emit(r1)
    .pipe(perSecond(10))
    .pipe(stopCount(20))
    .pipe(progressDots())
    .pipe(responseDots())
    .pipe(callback(done))
    .pipe(send());
  });

  it('can print failure response dots', function(done) {
    server.setResponseCode(500);
    var finish = function(err) {
      // Don't call done(err) because we are expecting errors
      done();
    }
    emit(r1)
    .pipe(perSecond(10))
    .pipe(stopCount(20))
    .pipe(progressDots())
    .pipe(responseDots())
    .pipe(callback(finish))
    .pipe(send());
  });

});
