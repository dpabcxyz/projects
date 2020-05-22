import shipConfig from 'config/shipConfig'

export function duToGpsDM (duStr, duDir, fixednum) {
    duStr = (duStr.toString()).replace(/\s+/g, '')
    var strLength = duStr.length
    var tempString = ''
    var tempStrArray = new Array()
    var tempCount = 0
    var tempPointFlag = 0
    var gpsDM
    for (var i = 0; i <= strLength; i++) {
        if (duStr[i] >= '0' && duStr[i] <= '9') {
            tempPointFlag = 1
            tempString += duStr[i]
            continue
        } else if (duStr[i] == '.') {
            tempStrArray[tempCount] = tempString
            tempString = ''
            tempCount++
            tempStrArray[tempCount] = '.'
            tempPointFlag = 1
            tempCount++
        } else if (tempString.length > 0) {
            tempStrArray[tempCount] = tempString
            tempString = ''
            tempCount++
        }
    }
    if (tempPointFlag == 1) {
        var num1 = tempStrArray[0]
        if (!fixednum) fixednum = 3
        var num2 = (parseFloat('0' + tempStrArray[1] + tempStrArray[2], 10) * 60).toFixed(fixednum)
        // gpsDM=duDir+" "+num1+"°"+num2+"′";
        gpsDM = +num1 + '°' + num2 + '′' + ' ' + duDir
        // console.log(gpsDM);
    }
    return gpsDM
}

export function formatCoordinates (value) {
    let lat, lng

    if (Array.isArray(value)) {
        lat = value[0]
        lng = value[1]
    } else if (Object.prototype.toString.call(value) === '[object Object]') {
        lat = value['lat']
        lng = value['lng']
    } else {
        return value
    }
    if (lat < 0) {
        lat = duToGpsDM(lat, 'S')
    }
    if (lat >= 0) {
        lat = duToGpsDM(lat, 'N')
    }
    if (lng < 0) {
        // 如果小于-180 则
        if (lng < -180) {
            lng = 360 + lng
            lng = duToGpsDM(lng, 'E')
        } else {
            lng = duToGpsDM(lng, 'W')
        }
    }
    if (lng >= 0) {
        if (lng > 180) {
            lng = 360 - lng
            lng = duToGpsDM(lng, 'W')
        } else {
            lng = duToGpsDM(lng, 'E')
        }
    }
    return {
        lat,
        lng
    }
}

export function formatLat (lat) {
    if (typeof lat === 'undefined') return 0
    lat = lat / shipConfig.coeff
    if (lat < 0) {
        lat = duToGpsDM(lat, 'S')
    }
    if (lat >= 0) {
        lat = duToGpsDM(lat, 'N')
    }

    return lat
}
export function formatLng (lng) {
    if (typeof lng === 'undefined') return 0
    lng = lng / shipConfig.coeff
    if (lng < 0) {
        // 如果小于-180 则
        if (lng < -180) {
            lng = 360 + lng
            lng = duToGpsDM(lng, 'E')
        } else {
            lng = duToGpsDM(lng, 'W')
        }
    }
    if (lng >= 0) {
        if (lng > 180) {
            lng = 360 - lng
            lng = duToGpsDM(lng, 'W')
        } else {
            lng = duToGpsDM(lng, 'E')
        }
    }
    return lng
}

export function lonLatTranslate (value, valuetype) {
    var backvalue = ''
    if (valuetype === 'lon') {
        if (value < 0) {
            if (value < -180) {
                value = 360 + value
                backvalue = duToGpsDM(value, 'E')
            } else {
                backvalue = duToGpsDM(value, 'W')
            }
        } else {
            if (value > 180) {
                value = 360 - value
                backvalue = duToGpsDM(value, 'W')
            } else {
                backvalue = duToGpsDM(value, 'E')
            }
        }
    } else if (valuetype == 'lat') {
        if (value < 0) {
            backvalue = duToGpsDM(value, 'S')
        } else {
            backvalue = duToGpsDM(value, 'N')
        }
    }
    return backvalue
}
