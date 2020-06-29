console.log("\nJavascript Throttle Demonstration\n")

// we'll use old-style require() to allow use with versions
// of Node.js prior to 13.
const Throttle = require('./throttle')

// A console.log replacement to include a timestamp
const CONSOLE = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

function WAIT(millis) {
    return {
        then: (fn) => {
            setTimeout(fn,millis)
        }
    }
}

// Common demonstration logic
function demoOf(tagline,demo) {
    CONSOLE(`${tagline} demonstration`)

    const MSG = (msg) => `${msg} --${tagline}--`

    // we should see all 3 of these
    demo.immediate(MSG('immediately #1'))
    demo.immediate(MSG('immediately #2'))
    demo.immediate(MSG('immediately #3'))

    // we should see only 1 of these
    demo.debounced(MSG('debounce #1'))
    demo.debounced(MSG('debounce #2'))
    demo.debounced(MSG('debounce #3'))

    WAIT(1000).then(() => {
        // we should see only 2 of these
        let regulator = { count: 0, timeout: null }
        regulator.timeout = setInterval(() => demo.regulated(MSG(`regulator #${++regulator.count}`)), 100)
        setTimeout(() => clearInterval(regulator.timeout), 1000)    
    })

    WAIT(5000).then(() => {
        // we should see all 9 of these, but over about a 4.5 second duration
        let interval = { count: 0, timeout: null }
        interval.timeout = setInterval(() => demo.throttled(MSG(`throttle #${++interval.count}`)), 100)
        setTimeout(() => clearInterval(interval.timeout), 1000)
    })
}

// Common construction of the demonstration object
function DEMO(tagline,fn) {
    WAIT(5000).then(() => {
        demoOf(tagline,{
            immediate: Throttle.immediate(fn),
            debounced: Throttle.debounced(fn,500),
            regulated: Throttle.regulated(fn,500),
            throttled: Throttle.throttled(fn,500)
        }) 
    })
}

// An object to test against
let target = { 
    // using an object property ensures our call context is set properly
    show(msg) { CONSOLE(`${msg} (${this.name})`) },
    name: 'target',
}    

CONSOLE('Waiting 5 seconds ...')
WAIT(5000).then(() => CONSOLE('5 seconds has elapsed'))

CONSOLE('Waiting another 5 seconds ...')
WAIT(5000).then(() => CONSOLE('another 5 seconds has elapsed'))

// And now for some demonstrations
DEMO('FUNCTION',CONSOLE)    
DEMO('METHOD',Throttle.METHOD(target,'show'))

