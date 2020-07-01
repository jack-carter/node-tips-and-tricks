const matrix = require('../src/matrix.js')

// because I"m lazy with logging
const LOG = (msg) => console.log(`${msg}`)

let M = matrix()

LOG(`\nnew matrix\n${M}`)

let count = 0

M.push(++count)

LOG(`\nmatrix after 1 push\n${M}`)

M.push(++count)
M.push(++count)

LOG(`\nmatrix after 3 pushes\n${M}`)

M.next()

LOG(`\nmatrix after new epoch\n${M}`)

M.push(++count)
M.push(++count)

LOG(`\nmatrix after 2 more pushes\n${M}`)

M.collapse()

LOG(`\nmatrix after collapse\n${M}`)
