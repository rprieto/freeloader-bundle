# freeloader-bundle

Collection of streams for [freeloader](https://github.com/rprieto/freeloader).
They're roughly divided into 3 categories:

## Emitters

These streams generate 1 or more requests from their input.
You'll usually use 1 emitter only, but some support being combined together.

- `times(5)` : fire 5 requests instead of a single one
- `perSecond(10)` : generate 10 requests per second
- `concurrent(50)` : always maintain 50 requests in flight
- `transform(fn)` : apply the given function to each request

## Stop conditions

These can force upstream modules to stop on a certain condition.
They **must** be placed downstream from emitting modules like `perSecond()`.

- `stopTimer('10s')` : stop after 10 seconds
- `stopCount(50)` : stop after 50 responses have been received

## Reporters

These streams analyse requests and responses to generate reports and statistics.
You can pipe several reporters one after the other.

- `progressDots()` : print a dot for each request sent
- `print()` : print every request/response going through
- `consoleSummary()` : print general stats to the console
- `callback(fn)` : call a callback when all responses have arrived (`callback(err)`)
- `then(fn, fn)` : promise-like handler when all responses have arrived (`resolved(), rejected()`)
