/**
 * @title [数据存储模块，将数据存储以Base64格式存储在localStorage中]
 */
import { Base64 } from 'js-base64'
var random = [1, 2, 4, 5, 9, 'a', 'e', 'g', 'c', 'z']
function getRandom () {
    var len = random.length

    return random[Math.floor(Math.random() * len)]
}

var storage = {
    // 存储
    set (key, value) {
        var tmp = JSON.stringify(value)
        localStorage.setItem(key, getRandom() + Base64.encode(tmp))
    },
    // 取出数据
    get (key) {
        if (!localStorage.getItem(key)) return null
        try {
            return JSON.parse(Base64.decode(localStorage.getItem(key).slice(1)))
        } catch (error) {
            return null
        }
    },
    // 删除数据
    remove (key) {
        localStorage.removeItem(key)
    },
    clear () {
        localStorage.clear()
    }

}
export default storage
