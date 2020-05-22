import Vue from 'vue'
import { formatCoordinates, formatLat, formatLng } from './gps'
import shipConfig from 'config/shipConfig'
import day from 'dayjs'

Vue.filter('formatCoord', function (value) {
    return formatCoordinates(value)
})
Vue.filter('formatLat', function (value) {
    if (!value) return ''
    return formatLat(value)
})
Vue.filter('formatLng', function (value) {
    if (!value) return ''
    return formatLng(value)
})
Vue.filter('shipStatus', function (value) {
    if (!value) return ''
    return shipConfig.shipStatus[value] ? shipConfig.shipStatus[value] : ''
})

Vue.filter('formatTime', function (value, type = 'YYYY-MM-DD HH:mm:ss') {
    if (!value) return ''
    return day(value * 1000).format(type)
})
