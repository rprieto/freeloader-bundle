require('freeloader').global();
require('../index').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(perSecond(5))
.pipe(stopTimer('3s'))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
