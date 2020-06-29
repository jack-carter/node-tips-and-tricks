console.log("\nJavascript Throttle Demonstration\n")

// A console.log replacement to include a specific format for all logging
const CONSOLE = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

/**
 * There are 4 types of throttle strategies we use in Javascript:
 * 
 * 1) Immediately - to invoke something without delay
 * 2) Debounce - to keep from processing multiple user operations
 * 3) Regulator - to the number of times we respond to high-volume events
 * 4) Valve - to control how fast we make API calls
 * 
 */

/**
 * This component provides a convenient wrapper that will immediately
 * invoke the function provided as a target. It can act as a placeholder
 * when using a combination of throttles, so code can quickly switch
 * between the different strategies.
 * 
 * @param {*} fn the function to invoke
 */
function immediately(fn) {
    return (args) => fn(args)
}

 /**
  * This component provides a wrapper around a function invocation
  * limiting the invocation to the last invocation requested within
  * the time limit proscribed by 'delay'.
  * 
  * By design this component is 'lossy' in that it quietly ignores
  * intervening invocation requests, taking only the last one within
  * the proscribed time limit.
  * 
  * @param {*} fn the function to invoke (required)
  * @param {*} delay number of milliseconds to wait for subsequent requests (required) 
  */
 function debounce(fn,delay) {
    let timeout
    return (args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(args),delay)
    }
 }

 /**
  * This component provides a wrapper around a function invocation
  * limiting the rate of invocations not to exceed the time limit
  * which is provided.
  * 
  * By design this component is 'lossy' in that it quietly ignores
  * subsequent invocations until the proper delay has elapsed.
  * 
  * @param {*} fn the function to invoke (required)
  * @param {*} limit number of milliseconds to wait for subsequent requests (required) 
  */
function regulate(fn,limit) {
    let throttling
    return (args) => {
        if (!throttling) {
            throttling = true
            fn(args)
            setTimeout(() => throttling = false,limit)    
        }
    }
}

/** 
 * This component provides a wrapper around a function invocation
 * limiting the rate of invocations not to exceed the time limit
 * which is provided.
 * 
 * By design this component is 'lossless' in that although it will
 * post-pone subsequent invocations made within the specified time
 * limit, it will eventually complete every request by 'draining'
 * the requests from a FIFO queue.
 * 
 * Required:
 * 'fn' is the function to be called
 * 'delay' is the time in milliseconds to wait between invocations
 * 
 * Optional:
 * 'scope' is the context to be applied to the invocation
 */
function throttle(fn,limit) {
    let requests = []
    let throttling

    let end = () => {
        throttling = false
        requests.length && begin()
    }

    let begin = () => {
        throttling = true
        fn(requests.shift())
        setTimeout(end,limit)
    }

    return (args) => {
        requests.push(args)
        throttling || begin()
    }
}

// Common demonstration logic
function demoOf(tagline,demo) {
    const MSG = (msg) => `--${tagline}-- ${msg}`

    // we should see all 3 of these
    demo.immediately(MSG('immediately #1'))
    demo.immediately(MSG('immediately #2'))
    demo.immediately(MSG('immediately #3'))

    // we should see only 1 of these
    demo.debounce(MSG('debounce #1'))
    demo.debounce(MSG('debounce #2'))
    demo.debounce(MSG('debounce #3'))

    // we should see only 2 of these
    let regulators = 1
    let regulator = setInterval(() => demo.regulate(MSG(`regulator #${regulators++}`)), 100)
    setTimeout(() => clearInterval(regulator), 1000)

    // we should see all 9 of these, but over about a 4.5 second period
    let intervals = 1
    let interval = setInterval(() => demo.throttle(MSG(`throttle #${intervals++}`)), 100)
    setTimeout(() => clearInterval(interval), 1000)
}

// Common construction of the demonstration object
function DEMO(tagline,fn) {
    demoOf(tagline,{
        immediately: immediately(fn),
        debounce: debounce(fn,500),
        regulate: regulate(fn,500),
        throttle: throttle(fn,500)
    })    
}

const METHOD = (object,method) => object[method].bind(object)
const object = { doThis: CONSOLE }    

DEMO('FUNCTION',CONSOLE)    
DEMO('METHOD',METHOD(object,'doThis'))
