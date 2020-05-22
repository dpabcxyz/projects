import axios from 'api/axios'
import Api from 'api/api'

function filterFleetData (data, groupName) {
    for (const key in data) {
        if (data[key].groupName === groupName) {
            return data[key]
        }
    }
    return ''
}
const state = {
    fleet: [],
    fleetOriginal: [],
    fleetOriginalKeyValue: [],
    fleetBounds: [],
    group: [],
    fleetLength: 0,
    mmsiList: []
}

const getters = {
    fleet: (state) => {
        return state.fleet
    },
    group: (state) => {
        return state.group
    },
    fleetLength: (state) => {
        return state.fleetLength
    },
    mmsiList: (state) => {
        return state.mmsiList
    },
    fleetOriginalKeyValue: (state) => {
        return state.fleetOriginalKeyValue
    },
    fleetBounds: (state) => {
        return state.fleetBounds
    }

}

const actions = {
    getFleetList ({ dispatch, commit, getters, rootGetters }) {
        var params = {
            userId: rootGetters['user/userId']
        }
        let language = rootGetters['language']

        axios.restFull({
            method: 'get',
            url: Api.selectManagerShip,
            params: params
        }).then((res) => {
            commit('setFleetOriginal', res)
            commit('setFleetOriginalKeyValue')
            commit('arrangeData', {
                res, language
            })
            dispatch('map/getShipLocation', res, { root: true })
            commit('map/fitBounds', getters.fleetBounds, { root: true })
        })
    },
    changeFleetItem ({ dispatch, commit, getters, rootGetters }, payload) {
        let { groupName, mmsi, checked } = payload
        var payloadDemo = {
            groupName,
            key: 'checked',
            mmsi: mmsi,
            value: checked
        }
        commit('changeFleetItem', payloadDemo)
        if (checked) {
            commit('map/addShipLayer', mmsi, { root: true })
        } else {
            commit('map/removeShipLayer', mmsi, { root: true })
        }
    },
    toggleFleetShip ({ dispatch, commit, getters, rootGetters }, payload) {
        let { mmsi, status } = payload
        let data = getters.fleetOriginalKeyValue
        if (data[mmsi]) {
            let groupName = data[mmsi].groupName
            dispatch('changeFleetItem', {
                groupName, mmsi, checked: status
            })
        }
    },
    toggleFleetGroup ({ dispatch, commit, getters, rootGetters }, groupName) {
        commit('toggleFleetGroup', groupName)
    },

    renameGroup ({ dispatch, commit, getters, rootGetters }, payload) {
        commit('renameGroup', payload)
    },

    getShipCood ({ dispatch, commit, getters, rootGetters }, mmsi) {
        let data = getters.fleetOriginalKeyValue
        return data[mmsi] ? data[mmsi] : null
    }

}

const mutations = {
    arrangeData (state, fleetData) {
        // 整理数据
        // var self = this
        var { res: data, language } = fleetData
        var groupName = []
        var mmsiList = []
        var arrangeData = {}
        var bounds = []
        var length = data.length
        var defaultGroupName = (language.indexOf('zh') > -1 ? '默认分组' : 'Default Group')
        for (let i = 0; i < length; i++) {
            const item = data[i]
            mmsiList.push(item.mmsi)
            // 获取分组名称
            groupName.push(item.groupName)

            // 收集坐标
            bounds.push([item.lat / 600000, item.lon / 600000])
            // 归集数据
            var opitons = arrangeData[item.groupName]
            if (opitons) {
                if (typeof item.checked === 'undefined') {
                    item.checked = true
                }
                opitons.children.push(item)
            } else {
                arrangeData[item.groupName] = {
                    colorvalue: item.colorvalue,
                    groupName: item.groupName || defaultGroupName,
                    children: [],
                    checked: true
                }

                if (typeof item.checked === 'undefined') {
                    item.checked = true
                }
                arrangeData[item.groupName].children.push(item)
            }
        }
        var treeData = []

        // 置顶默认分组
        if (arrangeData['null']) {
            treeData.push(arrangeData['null'])
        }
        for (const key in arrangeData) {
            if (key !== 'null') {
                treeData.push(arrangeData[key])
            }
        }

        state.group = new Set([...groupName])
        state.fleet = treeData
        state.mmsiList = mmsiList
        state.fleetBounds = bounds
    },
    setFleetOriginal (state, payload) {
        if (typeof payload === 'undefined') return

        state.fleetOriginal = payload
        state.fleetLength = payload.length
    },
    setFleetOriginalKeyValue (state) {
        var len = state.fleetOriginal.length
        var tmp = {}
        for (let i = 0; i < len; i++) {
            const element = state.fleetOriginal[i]
            tmp[element.mmsi] = element
        }
        state.fleetOriginalKeyValue = tmp
    },
    changeFleetItem (state, payload) {
        // var payloadDemo = {
        //     groupName: '',
        //     mmsi: 'mmsi',
        // }
        if (typeof payload === 'undefined') return
        let { groupName, mmsi } = payload

        let filterData = filterFleetData(state.fleet, groupName)
        if (!filterData) return
        let groupChecked = filterData.checked
        let tmpArray = filterData.children
        for (const i in tmpArray) {
            const child = tmpArray[i]
            if (child.mmsi === mmsi) {
                child['checked'] = groupChecked
                break
            }
        }
    },
    toggleFleetGroup (state, groupName) {
        // mutation
        if (typeof groupName === 'undefined') return
        let filterData = filterFleetData(state.fleet, groupName)
        if (!filterData) return
        let tmpArray = filterData.children
        for (const i in tmpArray) {
            const child = tmpArray[i]
            child.checked = !filterData.checked
            if (child.checked) {
                this.commit('map/addShipLayer', child.mmsi, { root: true })
            } else {
                this.commit('map/removeShipLayer', child.mmsi, { root: true })
            }
        }
    },

    renameGroup  (state, payload) {
        if (typeof payload === 'undefined') return
        let { name, index } = payload
        state.fleet[index].groupName = name
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
