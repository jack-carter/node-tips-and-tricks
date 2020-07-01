const Throttle = require('../src/throttle')

const immediate = Throttle.immediate
const debounced = Throttle.debounced
const throttled = Throttle.throttled
const regulated = Throttle.regulated

const fn = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)
const counter = (counter) => `(${counter})`
const as = (name,count) => `${counter(count)} ${name}`

{
    let count = 0
    let msg = () => as(`immediate()`,++count)
    let call = immediate(fn)

    call(msg())
    call(msg())
    call(msg())    
}

{
    let count = 0
    let msg = () => as(`debounced(immediate())`,++count)
    let call = debounced(immediate(fn))

    call(msg())
    call(msg())
    call(msg())    
}

{
    let count = 0
    let msg = () => as(`debounced(regulated(immediate()))`,++count)
    let call = debounced(regulated(immediate(fn)))

    call(msg())
    call(msg())
    call(msg())    
}

{
    let count = 0
    let msg = () => as(`debounced(throttled(immediate()))`,++count)
    let call = debounced(throttled(immediate(fn)))

    call(msg())
    call(msg())
    call(msg())    
}
