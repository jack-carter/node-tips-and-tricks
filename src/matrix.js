module.exports = function() {
    let _matrix = []

    const epoch = () => Math.max(_matrix.length - 1,0)
    const format = (array,index) => `[${index}] -> [${array}]`
    const check = () => _matrix[epoch()] = _matrix[epoch()] ? _matrix[epoch()] : []
    const collapse = (array,row) => [...array,...row]

    return {
        push: (item) => {
            check().push(item)
        },

        next: () => {
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
