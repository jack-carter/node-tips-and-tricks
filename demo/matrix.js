// because I"m lazy with logging
function LOG(msg) {
    console.log(`${msg}`)
}

function matrix() {
    let _matrix = []

    const epoch = () => Math.max(_matrix.length - 1,0)
    const format = (array,index) => `[${index}] -> [${array}]`
    const check = () => _matrix[epoch()] = _matrix[epoch()] ? _matrix[epoch()] : []
    const collapse = (array,row) => [...array,...row]

    return {
        push: (item) => {
            check().push(item)
        },

        newEpoch: () => {
            _matrix.push([])
        },

        collapse: () => {
            _matrix = [_matrix.reduce(collapse,[])]
        },

        toString: () => {
            return _matrix.length == 0 ? '[]' : 
                _matrix.map((row,index) => format(row,index)).reduce((string,row) => string.concat(row,'\n'),'')
        }
    }
}

let count = 0
let M = matrix()

LOG(`\nnew matrix\n${M}`)

M.push(++count)

LOG(`\nmatrix after 1 push\n${M}`)

M.push(++count)
M.push(++count)

LOG(`\nmatrix after 3 pushes\n${M}`)

M.newEpoch()

LOG(`\nmatrix after new epoch\n${M}`)

M.push(++count)
M.push(++count)

LOG(`\nmatrix after 2 more pushes\n${M}`)

M.collapse()

LOG(`\nmatrix after collapse\n${M}`)
