/**
 * This component provides a declarative way to use setTimeout().
 * 
 * @param {*} millis is the number of milliseconds to wait after then() is called
 */
module.exports.wait = function(millis) {
    return {
        then: (fn) => setTimeout(fn,millis)
    }
}

/**
 * This component provides a declarative way to create repeating intervals
 * much in the same line as setInterval().
 * 
 * @param {*} millis is the number of milliseconds to wait after then()
 */
module.exports.every = function(millis) {
    let _duration
    let _interval
    let _timer

    let _cancel = () => _interval && clearInterval(_interval)
    let _start = () => _timer = _duration ? setTimeout(() => clearInterval(_interval),_duration) : _timer

    let _self = {
        until: (duration) => {
            _duration = duration
            delete this.until
            return _self
        },

        then: (fn) => {
            _start()            
            _interval = setInterval(fn,millis)
            delete this.then
            return _self
        },

        cancel: () => {
            _cancel()
            delete this.then
            return _self
        }
    }

    return _self
}