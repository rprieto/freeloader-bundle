require('freeloader').global();
require('../index').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(stopTimer('3s'))
.pipe(perSecond(2))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
