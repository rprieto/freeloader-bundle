require('freeloader').global();
require('../index').global();

var r1 = request.get('http://localhost:3000/hello')
                .header('Accept', 'application/json');

var r2 = request.get('http://localhost:3000/world')
                .header('Accept', 'application/json');

join(emit(r1), emit(r2))
.pipe(times(5))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
