'use strict'

const Scheduling = require('./scheduling')

// Export scheduling facilities to allow importing only this file.
module.exports.wait = Scheduling.wait
module.exports.every = Scheduling.every

// A helper function for wrapping functions on instances
module.exports.METHOD = (object,method) => object[method].bind(object)

/**
 * There are 4 types of throttle strategies we use in Javascript:
 * 
 * 1) immediate - to invoke something without delay
 * 2) debounced - to invoke only the last of many requests
 * 3) regulated - to invoke only so many requests per unit time
 * 4) throttled - to invoke all requests, but limit the rate of calls
 */

/**
 * This component provides a convenient wrapper that will immediately
 * invoke the function provided as a target. It can act as a placeholder
 * when using a combination of throttles, so code can quickly switch
 * between the different strategies.
 * 
 * @param {*} fn the function to invoke
 */
module.exports.immediate = function(fn) {
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
 module.exports.debounced = function(fn,delay) {
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
module.exports.throttled = function(fn,limit) {
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
 * @param {*} fn the function to invoke (required)
 * @param {*} limit number of milliseconds to wait for subsequent requests (required) 
 */
module.exports.regulated = function(fn,limit) {
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
