import statis from '../config/statisMap'

export function tableHeader (array, action) {
    if (!array.length) return []

    let headeArray = []

    array.forEach((item) => {
        var { key } = item
        var obj = {
            ...item,
            title: statis[key]
        }
        headeArray.push(obj)
    })

    if (action) {
        headeArray.push(action)
    }

    return headeArray
}
export function getHeader (key) {
    if (!key) return ''
    return statis[key]
}
