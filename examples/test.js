require('freeloader').global();
require('../index').global();

var r1 = request.get('http://localhost:3000/hello')
                .header('Accept', 'application/json');

var r2 = request.get('http://localhost:3000/world')
                .header('Accept', 'application/json');

emit(r1)
.pipe(perSecond(2))
.pipe(times(2))
.pipe(stopCount(8))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(callback(done))
.pipe(send());


function done(err) {
  console.log('Finished', err);
}
