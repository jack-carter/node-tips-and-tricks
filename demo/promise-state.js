const PromiseState = require('../src/promise-state')

const CONSOLE = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`)
const LOG = (title) => (data) => CONSOLE(`${title} ${data}`)

const resolved = Promise.resolve('RESOLVED').then(LOG('resolved:'))

PromiseState(resolved).then(LOG('resolved.state:'))

const wait = (millis) => (resolve,reject) => setTimeout(() => resolve('DONE'),millis)
const delayed = new Promise(wait(3000)).then(LOG('delayed:'))

PromiseState(delayed).then(LOG('delayed.state:'))

setTimeout(() => PromiseState(delayed).then(LOG('delayed.state:')),5000)
