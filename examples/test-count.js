require('freeloader').global();
require('../index').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(perSecond(2))
.pipe(stopCount(4))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(send());
