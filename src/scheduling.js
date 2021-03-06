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
 * This component provides a declarative means to create a recurring
 * sequence of actions that vary by a dynamically adjusting delay.
 */
module.exports.after = function(millis) {
    // our delay will vary over time, but it will begin with millis
    let _delay = millis

    let _duration
    let _interval
    let _timer

    let _adjust = (adj) => adj // by default we'll use the same delay every time
    let _cancel = () => _interval && clearTimeout(_interval)
    let _until = (duration) => _timer = duration ? setTimeout(() => _cancel(),duration) : _timer
    let _start = (fn) => _interval = setTimeout(() => _tick(fn),_delay)

    let _tick = (fn) => {
        fn()
        _cancel()
        _delay = _adjust(_delay)
        _interval = setTimeout(() => _tick(fn),_delay)
    }

    let _self = {
        varyBy: (dynamicAdjustment) => {
            _adjust = dynamicAdjustment
            delete this.varyBy
            return _self
        },

        until: (duration) => {
            _duration = duration
            delete this.until
            return _self
        },

        then: (fn) => {
            _until(_duration)            
            _start(fn)
            delete this.varyBy
            delete this.until
            delete this.then
            return _self
        },

        cancel: () => {
            _cancel()
            delete this.varyBy
            delete this.until
            delete this.then
            return _self
        }
    }

    return _self
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
    let _start = () => _timer = _duration ? setTimeout(() => _cancel(),_duration) : _timer

    let _self = {
        until: (duration) => {
            _duration = duration
            delete this.until
            return _self
        },

        then: (fn) => {
            _start()            
            _interval = setInterval(fn,millis)
            delete this.until
            delete this.then
            return _self
        },

        cancel: () => {
            _cancel()
            delete this.until
            delete this.then
            return _self
        }
    }

    return _self
}
