require('freeloader').global();
require('../index').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(stopTimer('4s'))
.pipe(perSecond(5))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
