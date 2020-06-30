# node-tips-and-tricks

<<<<<<< HEAD
=======
## Background

>>>>>>> fbbd280ac275792ba3dfb5919068f7addb5d99fd
In Javascript programming, be it for an in-browser web application or a back-end API, there are times when we need to be very specific about handling the various events our application and back-end rely upon.

For in-browser web applications it is common to:

* Debounce user operations so we only perform them once
* Throttle calls to an event handler or API by only invoking them when it's appropriate
<<<<<<< HEAD
* Regulate calls to a function, event handler, or API to ensure they occur on a specific time boundary
=======
* Regulate calls to a function, event handler, or API to ensure they occur on a specific time boundary

To assist with these challenges this project demonstrates a tiny library that provides a declarative means to use each of the above, plus a few more.

## Library calls

* `immediate()` to call a function normally
* `debounced()` to limit invocations to only 1 during a specific time limit
* `throttled()` to limit invocations to only 1 during every specified period
* `regulated()` to preserve every invocation, but invoke them along specific time boundaries

## Function invocations

For the next section we're going to use a simple function to demonstrate each of the library calls.

```
const CONSOLE = (msg) => () => console.log(msg)
```

### Immediate invocations

The following acts the same as if we'd called `console.log()` directly

```
const logit = immediate(CONSOLE)

logit('immediate')
```

### Debouncing invocations

The following acts the same as if we'd called only the last one

```
const logit = debounced(CONSOLE,500)

logit('debounced #1')
logit('debounced #2')
logit('debounced #3')
```

will produce the following:

```
debounced #3
```

### Throttling invocations

The following demonstrates how throttling only reacts every so often.

```
const logit = throttled(CONSOLE,500)

let count = 0
let interval = setInterval(() => logit(`throttled #${++count}`), 100)
setTimeout(() => clearInterval(interval), 1000)
```

will produce the following:

```
throttled #1
throttled #6
```

### Regulating invocations

The following demonstrates how every invocation will eventually be performed, but there will be a minimum delay between each one.

```
const logit = regulated(CONSOLE,500)

let count = 0
let interval = setInterval(() => logit(`regulated #${++count}`), 100)
setTimeout(() => clearInterval(interval), 1000)
```

will produce the following:

```
regulated #1
regulated #2
regulated #3
regulated #4
regulated #5
regulated #6
regulated #7
regulated #8
regulated #9
```

but the elapsed time of all those invocations will occur over about 4.5 seconds

## Helper functions

The runtime environments of Javascript (a.k.a. browsers and Node.js) provide simple scheduling features for programs to use. Most notable are:

* `setTimeout()` to schedule an action for some time in the future
* `setInterval()` to schedule a recurring action for some time in the future

This library provides more declarative ways to to the same as the above by providing:

* `wait()`
* `every()`
* `at()`

### Scheduling a function in the future

```
wait(500).then(CONSOLE('I waited 500 ms'))
```

### Scheduling a function to recur every so often

If I wanted to show the ticking of the clock roughly every 1 second I would use the following:

```
every(1000).then(CONSOLE('tick'))
```

If I wanted to do the same as the above, but only do it for 10 seconds I would use:

```
every(1000).until(10000).then(CONSOLE('tick'))
```

### Scheduling a function to occur at a variable rate

To illustrate the examples in this section we're going to use a randomly generated time delay defined by this function:

```
const RANDOM = (min,max) => return Math.floor(Math.random() * (max - min + 1) + min)
```

where a caller can simply use `RANDOM(500,5000)` to vary the delay between 500 to 5000 ms.

If I wanted to start a series of recurring events, but randomly select how much delay I want between each one I would use:

```
let count = 0
at(500).varyBy(RANDOM(500,5000)).then(CONSOLE(`[${new Date().toISOString()}] tick #${++count}`))
```

and if I wanted to do the above, but have it stop after 30 seconds I would use:

```
let count = 0
at(500).until(30000).varyBy(RANDOM(500,5000)).then(CONSOLE(`[${new Date().toISOString()}] tick #${++count}`))
```

or I could also use:

```
let count = 0
at(500).varyBy(RANDOM(500,5000)).until(30000).then(CONSOLE(`[${new Date().toISOString()}] tick #${++count}`))
```



>>>>>>> fbbd280ac275792ba3dfb5919068f7addb5d99fd
