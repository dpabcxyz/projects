export function isEmptyObj (obj) {
    for (var key in obj) {
        return false
    }
    return true
}

// geo数据倒置
export function reversLatLngs (array) {
    if (!Array.isArray(array)) return
    var tmpArray = []

    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i][0])) {
            return reversLatLngs(array[i])
        } else {
            let [x, y] = array[i]
            tmpArray.push([y, x])
        }
    }
    return tmpArray
}
