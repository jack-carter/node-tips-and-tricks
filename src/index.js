// we'll use old-style require() to allow use with versions
// of Node.js prior to 13.
const Throttle = require('./throttle')

const wait = Throttle.wait
const every = Throttle.every

// A console.log replacement to include a timestamp
const CONSOLE = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)

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

    wait(1000).then(() => {
        // we should see all 9 of these, but over about a 4.5 second duration
        let interval = { count: 0, timeout: null }
        interval.timeout = setInterval(() => demo.throttled(`throttled #${++interval.count}`), 100)
        setTimeout(() => clearInterval(interval.timeout), 1000)
    })

    wait(3000).then(() => {
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
}    

// A simple demonstration wait()
wait(500).then(() => CONSOLE(`wait #1`))
wait(100).then(() => CONSOLE(`wait #2`))

// A simple demonstration of every() using just a duration
wait(1000).then(() => {
    let count = 0
    const cycle = every(200).then(() => CONSOLE(`every #${++count}`))
    wait(1000).then(() => cycle.cancel())    
})
// A simple demonstration of every() using a dynamic period
wait(2000).then(() => {
    let count = 0
    const cycle = every(200).until(1000).then(() => CONSOLE(`until #${++count}`))
})

// A simple demonstration of every().adjust() using both an initial duration and a dynamic period

// And now for some demonstrations
wait(3000).then(() => DEMO('FUNCTION',CONSOLE)) 

// A demonstration of using wait()
wait(10000).then(() => DEMO('METHOD',Throttle.METHOD(target,'save')))

