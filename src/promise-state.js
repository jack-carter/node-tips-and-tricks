module.exports = function PromiseState(promise) {
    let _resolved = false
    let _rejected = false

    let state = {
        isResolved: () => _resolved,
        isRejected: () => _rejected,
    }

    state.isPending = () => !(state.isResolved() || state.isRejected())
    state.status = () => state.isPending() ? 'PENDING' : state.isResolved() ? 'RESOLVED' : state.isRejected() ? 'REJECTED' : 'UNKNOWN'
    state.toString = () => `{ status: ${state.status()}, isPending: ${state.isPending()}, isResolved: ${state.isResolved()}, isRejected: ${state.isRejected()} }`

    const resolved = () => _resolved = true
    const rejected = () => _rejected = true

    const waitOneTick = () => {
        return new Promise(done => setTimeout(() => done(state),0))
    }
    
    return Promise.race([waitOneTick(),promise.then(resolved,rejected)]).then(() => state)
}