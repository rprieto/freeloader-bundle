require('freeloader').global();
require('../index').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(perSecond(3))
.pipe(times(5))
.pipe(stopCount(13))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
