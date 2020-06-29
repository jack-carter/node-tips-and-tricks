console.log("\nJavascript Throttle Demonstration\n")

const Throttle = require('./throttle')

const immediate = Throttle.immediate
const debounced = Throttle.debounced
const throttled = Throttle.throttled
const regulated = Throttle.regulated
const METHOD = Throttle.METHOD

// Common demonstration logic
function demoOf(tagline,demo) {
    const MSG = (msg) => `${msg} --${tagline}--`

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
        immediately: immediate(fn),
        debounce: debounced(fn,500),
        regulate: regulated(fn,500),
        throttle: throttled(fn,500)
    })    
}

// A console.log replacement to include a timestamp
const CONSOLE = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

// An object to test against
let target = { 
    // using an object property ensures our call context is set properly
    show(msg) { CONSOLE(`${msg} (${this.name})`) },
    name: 'target',
}    

// And now for some demonstrations
DEMO('FUNCTION',CONSOLE)    
DEMO('METHOD',METHOD(target,'show'))
