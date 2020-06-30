// we'll use old-style require() to allow use with versions
// of Node.js prior to 13.
const Throttle = require('./throttle')

// We're going to capture activity in a history object, so 
// we can collect activity streams separately for each demo
// ensuring when we print them out they are not intertwined.
function History(tagline) {
    this.tagline = tagline
    this.history = []

    function save(msg) {
        this.history.push(msg)
    }
}

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

    // we should see all 3 of these
    demo.immediate(`immediate #1`)
    demo.immediate(`immediate #2`)
    demo.immediate(`immediate #3`)

    // we should only see the last one of these
    demo.debounced(`debounced #1`)
    demo.debounced(`debounced #2`)
    demo.debounced(`debounced #3`)

    WAIT(1000).then(() => {
        // we should see all 9 of these, but over about a 4.5 second duration
        let interval = { count: 0, timeout: null }
        interval.timeout = setInterval(() => demo.throttled(`throttled #${++interval.count}`), 100)
        setTimeout(() => clearInterval(interval.timeout), 1000)
    })

    WAIT(3000).then(() => {
        // we should see only 2 of these
        let regulator = { count: 0, timeout: null }
        regulator.timeout = setInterval(() => demo.regulated(`regulated #${++regulator.count}`), 100)
        setTimeout(() => clearInterval(regulator.timeout), 1000)    
    })
}

// Common construction of the demonstration object
function DEMO(tagline,fn) {
    demoOf(tagline,{
        immediate: Throttle.immediate(fn),
        debounced: Throttle.debounced(fn,500),
        regulated: Throttle.regulated(fn,500),
        throttled: Throttle.throttled(fn,500)
    }) 
}

console.log("\nJavascript Throttle Demonstration\n")

// An object to test against
let target = { 
    // using an object property ensures our call context is set properly
    save(msg) { CONSOLE(`${msg} (${this.name})`) },
    name: 'target',
    history: new History('METHOD')
}    

// And now for some demonstrations
DEMO('FUNCTION',CONSOLE)    

WAIT(10000).then(() => DEMO('METHOD',Throttle.METHOD(target,'save')))

