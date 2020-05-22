import L from 'leaflet'
import img from 'img/notfleetrstop_icon.png'
import img2 from 'img/unshipfleetdrive1.png'
import lighShip from 'img/lighship.png'
import ligh from 'img/ship_select.png'
import shipConfig from 'config/shipConfig'
import axios from 'api/axios'
import Api from 'api/api'

// import axios from 'api/axios'
// import Api from 'api/api'
// 船舶的tooltip 左右显示标识
var shipIconTag = 1

let defaultShipIcon = L.icon({
    iconUrl: img2,
    iconAnchor: [16, 16],
    iconSize: [32, 32]
})

let lighShipIcon = L.icon({
    iconUrl: lighShip,
    iconAnchor: [16, 16],
    iconSize: [32, 32]
})

function sort (filed) {
    return function (a, b) {
        return a[filed] > b[filed]
    }
}
function filterVoyageData (data) {
    if (typeof data === 'undefined') return []

    var mergeData = [...data['data'], ...data['othervalue']]
    var sortData = mergeData.sort(sort('pos_time'))
    console.log(sortData)

    var latLngs = sortData.reduce((pre, cur) => {
        console.log(cur)
        let latLng = [cur.lat / 600000, cur.lon / 600000]
        console.log(latLng)

        // pre.push(latLng)
    }, [])
    var filterData = {
        data: sortData,
        latLngs: latLngs
    }
    console.log(filterData)
    return filterData
}

/* 计算弹框碰撞 */
function collision (map, markerList) {
    /* markerList 判断的集合 */
    let bounds = []

    markerList.eachLayer(layer => {
        /* 创建 bound 对象 传递左上，右下坐标 */
        layer.openTooltip()
        let bound = layer.getTooltip().getBound()

        /* markerList 依次判断碰撞 */
        let flag = true
        if (bounds.length > 0) {
            for (let n = 0; n < bounds.length; n++) {
                let b = bounds[n]
                // console.log('b', b)
                // console.log('bound', bound)
                // console.log(b.overlaps(bound))
                // console.log(b.intersects(bound))

                if (b.overlaps(bound) || b.intersects(bound)) {
                    layer.closeTooltip()
                    flag = false
                    break
                }
            }
        }

        if (flag) {
            bounds.push(bound)
        }
    })
}

let lighShiplist = []
const state = {
    mapView: null,
    shipLayersGroup: L.layerGroup([]),
    shipLayersData: {},
    voyageLayersGroup: L.layerGroup([]),
    voyageLayersData: {},
    reminderLayersGroup: L.layerGroup([]),
    reminderLayersData: {},
    typhoonLayersGroup: L.layerGroup([])
}

const getters = {
    map: (state) => state.mapView,
    shipLayersGroup: (state) => state.shipLayersGroup,
    shipLayersData: (state) => state.shipLayersData,
    voyageLayersGroup: (state) => state.voyageLayersGroup,
    voyageLayersData: (state) => state.voyageLayersData,
    reminderLayersGroup: (state) => state.reminderLayersGroup,
    typhoonLayersGroup: (state) => state.typhoonLayersGroup,
    reminderLayersData: (state) => state.reminderLayersData

}

const actions = {

    setShipCenter ({ commit }, payload) {
        if (typeof payload === 'undefined') return
        commit('setShipCenter', payload)
    },
    createShip ({ dispatch, commit }, payload) {
        const { mmsi, lon, lat, shipName, heading, course } = payload
        let { coeff } = shipConfig
        let icon = defaultShipIcon
        let latLng = [lat / coeff, lon / coeff]
        var marker = L.marker(latLng, {
            icon: icon,
            riseOnHover: true,
            riseOffset: 1000,
            rotationAngle: heading || course
        }).bindTooltip(shipName, {
            permanent: true,
            direction: shipIconTag % 2 ? 'left' : 'right',
            interactive: true,
            className: 'shipicon',
            offset: shipIconTag % 2 ? [-15, 0] : [15, 0]
        }).openTooltip()
        shipIconTag++
        // var tooltip = L.tooltip()
        marker.mmsi = mmsi
        marker.on('click', (e) => {
            commit('removeAllLigh')
            dispatch('shipView/openShipInfoView', mmsi, { root: true })
            commit('addLighShipIcon', mmsi)
        })

        marker.on('mouseover', (e) => {
            // marker.closeTooltip().openTooltip()
            marker.setZIndexOffset(12000)
        })

        marker.on('mouseout', (e) => {
            marker.setZIndexOffset(0)
        })

        commit('_addShipLayer', marker)
    },

    getShipLocation ({ dispatch, commit, rootGetters }, payload) {
        dispatch('clearShipLayers')
        payload.forEach((item) => {
            dispatch('createShip', item)
        })
        // commit('collision', rootGetters['fleet/fleet'])
    },

    removeShipLayer ({ dispatch, commit, rootGetters }, mmsi) {
        commit('removeShipLayer', mmsi)
    },
    clearShipLayers ({ dispatch, commit, rootGetters }) {
        commit('clearShipLayers')
    },
    addAllShipLayers ({ dispatch, commit, rootGetters }) {
        commit('addAllShipLayers')
    },
    addShipLayer ({ dispatch, commit, rootGetters }, mmsi) {
        commit('addShipLayer', mmsi)
    },

    removeVoyageLayer ({ dispatch, commit, rootGetters }, mmsi) {
        commit('removevoyageLayer', mmsi)
    },
    clearVoyageLayers ({ dispatch, commit, rootGetters }) {
        commit('clearvoyageLayers')
    },
    addAllVoyageLayers ({ dispatch, commit, rootGetters }) {
        commit('addAllvoyageLayers')
    },
    addVoyageLayer ({ dispatch, commit, rootGetters }, mmsi) {
        commit('addvoyageLayer', mmsi)
    },

    getVoyageData ({ dispatch, commit }, payload) {
        if (typeof payload === 'undefined') return

        axios.restFull({
            method: 'POST',
            url: Api.selectSingleVoyage,
            data: payload
        }).then((res) => {
            if (Object.keys(res).length > 0) {
                var group = L.layerGroup([])
                var pointGroup = L.layerGroup([])
                var voyageData = filterVoyageData(res)
                var latLngs = voyageData.latLngs
                var line = L.polyline(latLngs, { color: 'red' })

                latLngs.forEach((item) => {
                    L.circleMarker(item, { radius: 4 }).addTo(pointGroup)
                })
                group.addLayer(line)
                group.addLayer(pointGroup)
            } else {
                this.$Message.warning('暂无轨迹数据')
            }
        })
    },

    zoomEnd ({ dispatch, commit }, payload) {
        commit('zoomEnd')
    },

    addReminderLayer ({ dispatch, commit, getters }, payload) {
        dispatch('clearReminderLayer')
        if (typeof payload === 'undefined') return
        commit('addReminderLayer', payload)
        let { areaId, mmsi, latLngs } = payload

        dispatch('fleet/getShipCood', mmsi, { root: true }).then((data) => {
            if (data === null) return
            let latLng = [data.lat / 600000, data.lon / 600000]
            latLngs.push(latLng)
            commit('addLighShipIcon', mmsi)
            commit('fitBounds', latLngs)
        })
    },

    clearReminderLayer ({ dispatch, commit }) {
        commit('clearReminderLayer')
        commit('removeAllLigh')
    },

    clearTyphoonLayer ({ dispatch, commit }) {
        commit('clearTyphoonLayer')
    }

}

const mutations = {
    zoomEnd () {
        setTimeout(() => {
            collision(state.mapView, state.shipLayersGroup)
        }, 0)
    },
    mapView (state) {
        return state.mapView
    },
    fitBounds (state, latLngs) {
        if (typeof latLngs === 'undefined' || latLngs.length === 0) return
        state.mapView.fitBounds(latLngs)
    },
    setShipCenter (state, latlng) {
        state.mapView.setView(latlng)
    },
    setMapView (state, payload) {
        state.mapView = payload
        state.mapView.addLayer(state.shipLayersGroup)
        state.mapView.addLayer(state.voyageLayersGroup)
        state.mapView.addLayer(state.reminderLayersGroup)
        state.mapView.addLayer(state.typhoonLayersGroup)
    },
    _addShipLayer (state, payload) {
        if (typeof payload === 'undefined') return
        if (payload.mmsi) {
            state.shipLayersData[payload.mmsi] = payload
            if (!state.shipLayersGroup.hasLayer(payload)) {
                state.shipLayersGroup.addLayer(payload)
            }
        }
    },
    addShipLayer (state, mmsi) {
        if (typeof mmsi === 'undefined') return
        var layer = state.shipLayersData[mmsi]
        if (!state.shipLayersGroup.hasLayer(layer)) {
            state.shipLayersGroup.addLayer(layer)
        }
    },
    addLighShipIcon (state, mmsi) {
        if (typeof mmsi === 'undefined') return
        var layer = state.shipLayersData[mmsi]
        if (state.shipLayersGroup.hasLayer(layer)) {
            layer.setIcon(lighShipIcon)
            if (lighShiplist.indexOf(mmsi) < 0) {
                lighShiplist.push(mmsi)
            }
            console.log(lighShiplist)
        }
    },
    removeLighShipIcon (state, mmsi) {
        if (typeof mmsi === 'undefined') return
        var layer = state.shipLayersData[mmsi]
        if (state.shipLayersGroup.hasLayer(layer)) {
            layer.setIcon(defaultShipIcon)
            var index = lighShiplist.indexOf(mmsi)
            index > -1 ? lighShiplist.splice(index, 1) : ''
        }
    },
    removeAllLigh () {
        lighShiplist.forEach((item) => {
            this.commit('map/removeLighShipIcon', item, { root: true })
        })
    },
    addAllShipLayers (state) {
        let { shipLayersData } = state
        for (const key in shipLayersData) {
            var item = shipLayersData[key]
            if (!state.shipLayersGroup.hasLayer(item)) {
                state.shipLayersGroup.addLayer(item)
            }
        }
    },
    removeShipLayer (state, mmsi) {
        if (typeof mmsi === 'undefined') return
        if (state.shipLayersData[mmsi]) {
            // delete state.shipLayersData[payload.mmsi]
            state.shipLayersGroup.removeLayer(state.shipLayersData[mmsi])
        }
    },

    clearShipLayers (state) {
        state.shipLayersGroup.clearLayers()
    },
    addVoyageLayer (state, payload) {
        if (typeof payload === 'undefined') return
        if (payload.mmsi) {
            state.voyageLayersData[payload.mmsi] = payload
            if (!state.voyageLayersGroup.hasLayer(payload)) {
                state.voyageLayersGroup.addLayer(payload)
            }
        }
    },
    addAllVoyageLayers (state) {
        let { voyageLayersData } = state
        for (const key in voyageLayersData) {
            var item = voyageLayersData[key]
            if (!state.voyageLayersGroup.hasLayer(item)) {
                state.voyageLayersGroup.addLayer(item)
            }
        }
    },
    removeVoyageLayer (state, mmsi) {
        if (typeof mmsi === 'undefined') return
        if (state.voyageLayersData[mmsi]) {
            // delete state.voyageLayersData[payload.mmsi]
            state.voyageLayersGroup.removeLayer(state.shipLayersData[mmsi])
        }
    },

    clearVoyageLayers (state) {
        state.VoyageLayersGroup.clearLayers()
    },

    clearReminderLayer (state) {
        state.reminderLayersGroup.clearLayers()
        state.reminderLayersData = {}
    },

    addReminderLayer (state, payload) {
        if (typeof payload === 'undefined') return
        state.reminderLayersGroup.addLayer(payload)
        state.reminderLayersData[payload.areaId] = payload
    },
    mapAddLayer (state, payload) {
        if (typeof payload === 'undefined') return
        state.mapView.addLayer(payload)
    },
    mapRemoveLayer (state, payload) {
        if (typeof payload === 'undefined') return
        state.mapView.removeLayer(payload)
    },

    clearTyphoonLayer (state) {
        state.typhoonLayersGroup.clearLayers()
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
