# freeloader-bundle

![Travis CI status](https://api.travis-ci.org/rprieto/freeloader-bundle.png)

Collection of streams for [freeloader](https://github.com/rprieto/freeloader).
They're roughly divided into 3 categories:

- Emitters
  - [times(count)](#times)
  - [perSecond(count)](#perSecond)
  - [concurrent(count)](#concurrent)
  - [transform(fn)](#transform)

- Stop conditions
  - [stopTimer(duration)](#stopTimer)
  - [stopCount(count)](#stopCount)

- Reporters
  - [print()](#print)
  - [requestDots()](#requestDots)
  - [responseDots()](#responseDots)
  - [periodicSnapshot(time)](#periodicSnapshot)
  - [consoleSummary()](#consoleSummary)
  - [jsonSummary(path)](#jsonSummary)
  - [consoleCharts()](#consoleCharts)
  - [callback(fn)](#callback)
  - [then(fn, fn)](#then)

All these modules are [Node.js Transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform_1), so you can also easily [create your own](https://github.com/rprieto/freeloader-stream).

---

## <a name="times"></a> times(count)

Emits `count` requests for each incoming request.

*Example:*

```js
emit(r)
.pipe(times(5))
.send()
```

## <a name="perSecond"></a> perSecond(count)

Emits `count` requests per second for each incoming request.
This emitter only stops when you press `Ctrl-C` or when a downstream module requests a shutdown.

*Example:*

```js
emit(r)
.pipe(perSecond(10))
.send()
```

Note: the emitter can push out thousands of requests per second, but you will most likely be limited by the local network bottlneck.

## <a name="concurrent"></a> concurrent(count)

Maintains `count` requests in flight for each incoming request.
This emitter only stops when you press `Ctrl-C` or when a downstream module requests a shutdown.

This is the equivalent of `threads` in [JMeter](https://jmeter.apache.org).

*Example:*

```js
emit(r)
.pipe(concurrent(50))
.send()
```

## <a name="transform"></a> transform(fn)

Applies the `fn` function to every incoming request. For example, the function can add headers or modify the payload.

*Example:*

```js
function randomId(req) {
  req.body.myId = Math.floor(Math.random() * 1000);
}

emit(r)
.pipe(times(1000))
.pipe(transform(randomId))
.send()
```

## <a name="stopTimer"></a> stopTimer(duration)

Stop sending any more requests after `duration`. This module needs to be downstream of any emitting module, since the `pause` event bubbles up.

`duration` is a human readable string like `5s`, `20s`, `3m`, `1h`.

*Example:*

```js
emit(r)
.pipe(perSecond(5))
.pipe(stopTimer('10s'))
.send()
```

Note: this does not terminate the pipeline immediately. It simply asks upstream modules to stop sending requests. The shutdown can take a few seconds if modules are still waiting for responses to arrive (ex: `consoleSummary`).

## <a name="stopCount"></a> stopCount(count)

Shuts down the pipeline after `count` requests have gone through. This module needs to be downstream of any emitting module, since the `pause` event bubbles up.

`duration` is a human readable string like `5s`, `20s`, `3m`, `1h`.

*Example:*

```js
emit(r)
.pipe(perSecond(5))
.pipe(stopCount(30))
.send()
```

Note: this does not terminate the pipeline immediately. It simply asks upstream modules to stop sending requests. The shutdown can take a few seconds if modules are still waiting for responses to arrive (ex: `consoleSummary`).

## <a name="print"></a> print()

Prints every request and response as they arrive. This is useful for debugging, but usually too verbose for actual load tests.

*Example:*

```js
emit(r)
.pipe(print())
.send()
```

## <a name="requestDots"></a> requestDots()

Prints a dot for every request going through, as a way to track progress.

*Example:*

```js
emit(r)
.pipe(requestDots())
.send()
```

## <a name="responseDots"></a> responseDots()

For every response that comes back, prints a green 'o' (success) or a red 'x' (failure).

*Example:*

```js
emit(r)
.pipe(responseDots())
.send()
```

## <a name="periodicSnapshot"></a> periodicSnapshot(millis)

Prints the state of the test to the console every `millis` milliseconds. This includes total requests count, response count, and number of requests in flight.

*Example:*

```js
emit(r)
.pipe(periodicSnapshot(1000))
.send()
```

## <a name="consoleSummary"></a> consoleSummary()

Prints useful statistics to the console once all the responses have arrived, including the average response times.

*Example:*

```js
emit(r)
.pipe(consoleSummary())
.send()
```

## <a name="jsonSummary"></a> jsonSummary(path)

Similar to `consoleSummary`, but prints the statistics to a file. This is useful to integrate into a CI pipeline.

*Example:*

```js
emit(r)
.pipe(jsonSummary('test-report.json'))
.send()
```

## <a name="consoleCharts"></a> consoleCharts()

Prints bar charts to the console once the test has finished (response time distribution, ...).

*Example:*

```js
emit(r)
.pipe(consoleCharts())
.send()
```

## <a name="callback"></a> callback(fn)

Calls the `fn` function once the test is finished. The function will be called with an `Error` if any of the requests failed.

*Example:*

```js
function done(err) {
  console.log(err ? ('Test failed: ' + err) : 'Success');
}

emit(r)
.pipe(callback(done))
.send()
```

## <a name="then"></a> then(fnSuccess, fnFailure)

Promise-like API for when the test has finished. Will call `fnSuccess` if all the requests were successful, and `fnSuccess` if there were any errors.

*Example:*

```js
function success() {
  console.log('Success!');
}

function failure() {
  console.log('Failure:', err);
}

emit(r)
.pipe(then(success, failure))
.send()
```
