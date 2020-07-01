const matrix = require('../src/matrix')

const LOG = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

LOG(`LOG check`)

const CONSOLE = (msg) => () => LOG(msg)

CONSOLE(`CONSOLE check`)()

const reflector = (...args) => {
    LOG(args)
}

// Expressing limits

const Rate = { 
    of: (n) => { 
        let _count = 0
        return { 
            exceeded: () => _count >= n,
            increment: () => ++_count,
            decrement: () => {},
            reset: () => _count = 0
        } 
    } 
}

const Consecutive = { 
    of: (n) => { 
        let _count = 0
        return { 
            exceeded: () => _count >= n,
            increment: () => ++_count,
            decrement: () => --_count,
            reset: () => _count = 0
        } 
    } 
}

const Total = { 
    of: (n) => { 
        let _count = 0
        return { 
            exceeded: () => _count >= n,
            increment: () => ++_count,
            decrement: () => {},
            reset: () => {}
        } 
    } 
}

function Volume() {}

Volume.of = (n) => {
    return {
        every: (millis) => {}
    }
}

function limit(fn,...limits) {
    LOG(`limits -> ${limits}`)
    limits = limits ? limits : []
    return (...args) => {
        const invoke = (fn) => { 
            limits.forEach(limit => limit.increment())
            return fn(args) 
        }
        limits.every(limit => !limit.exceeded()) && invoke(fn)
    }
}

Rate.of(500)
Consecutive.of(5)
Total.of(20)
Volume.of(5).every(1000)

// Applying limits

/*
Limit.to(Rate.of(500))
Limit.to(Consecutive.of(5))
Limit.to(Total.of(20))
Limit.to(Volume.of(5).every(1000))

Limit.to(Rate.of(500),Consecutive.of(5),Total.of(20),Volume.of(5).every(1000))
*/

// No limits
{
    let counter = 0
    const fn = limit(reflector)
    fn(`no-limits ${++counter}`)
}

// Total limits
{
    let counter = 0
    const fn = limit(reflector,Total.of(2))
    fn(`total-limits ${++counter}`)
    fn(`total-limits ${++counter}`)
    fn(`total-limits ${++counter}`)
}

// Rate limits
{

}

// Consecutive limits
{
    let counter = 0
}

// Volume limits
{
    let counter = 0
}

// Combined limits
{
    let counter = 0
}

/**
 * This component is a protective wrapper around asynchronous calls,
 * so that we can limit the number of invocations based upon whatever
 * rules the caller has given in advance.
 */
function async_wrapper(fn,config) {
    return (...args) => {
        return fn(config,...args)
    }
}
