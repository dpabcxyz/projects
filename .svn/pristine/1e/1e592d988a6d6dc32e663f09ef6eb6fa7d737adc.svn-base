import axios from 'api/axios'
import Api from 'api/api'

const state = {
    // 船舶详情弹出
    showShipInfoView: false,
    showShipInfoViewMMSI: '',
    shipInfo: {},

    /* 救援任务 */
    showShipHelpView: false,
    helpHl: 10,
    helpShipConst: 0
}

const getters = {
    showShipInfoView: (state) => state.showShipInfoView,
    showShipInfoViewMMSI: (state) => state.showShipInfoViewMMSI,
    shipInfo: (state) => state.shipInfo,
    showShipHelpView: state => state.showShipHelpView,
    helpHl: state => state.helpHl,
    helpShipConst: state => state.helpShipConst
}

const actions = {
    openShipInfoView ({ dispatch, commit, rootGetters }, config) {
        let mmsi, type
        if (typeof config === 'object') {
            mmsi = config.mmsi
            type = config.type
        } else {
            mmsi = config
        }
        this.commit('closeWindow', 'info', { root: true })
        commit('setShipInfoViewMMSI', mmsi)
        this.commit('openWindowExclude', 'info', { root: true })
        var shipLatlng = rootGetters['fleet/fleetOriginalKeyValue'][mmsi]
        if (shipLatlng) {
            dispatch('map/setShipCenter', [shipLatlng.lat / 600000, shipLatlng.lon / 600000], { root: true })
            dispatch('getShipAis', mmsi).then((res) => {
                commit('setShipInfo', res)
            })
        } else {
            console.log('不在船队内...')
            dispatch('getShipAis', mmsi).then((res) => {
                commit('setShipInfo', res)
            })
        }
    },
    closeShipInfoView ({ commit }, mmsi) {
        commit('closeShipInfoView')
        commit('setShipInfoViewMMSI', '')
        mmsi && commit('map/removeLighShipIcon', mmsi, { root: true })
        console.log('关闭高亮')
    },

    openShowShipHelpView ({ commit }) {
        commit('openShowShipHelpView')
    },
    closeShowShipHelpView ({ commit }) {
        commit('closeShowShipHelpView')
    },
    helpHlChange ({ commit }, n) {
        commit('helpHlChange', n)
    },
    helpShipConstChange ({ commit }, n) {
        commit('helpShipConstChange', n)
    },

    async getShipAis ({ dispatch, commit, rootGetters }, mmsi) {
        var params = {
            mmsi,
            userId: rootGetters['user/userId']
        }
        let data = await axios.restFull({
            method: 'post',
            url: Api.getAis,
            data: params
        })

        return data
    }
}

const mutations = {
    closeShipInfoView (state) {
        this.commit('closeWindow', 'info', { root: true })
    },
    openShipInfoView (state, type) {
        if (type != 'SOS') {
            state.showShipHelpView = false
        }
        this.commit('openWindowExclude', 'info', { root: true })
    },

    setShipInfoViewMMSI (state, mmsi) {
        state.showShipInfoViewMMSI = mmsi
    },
    setShipInfo (state, aisInfo) {
        state.shipInfo = aisInfo
    },
    openShowShipHelpView (state) {
        state.showShipHelpView = true
    },
    closeShowShipHelpView (state) {
        state.showShipHelpView = false
    },
    helpHlChange (state, n) {
        n = parseInt(n)
        if (!isNaN(n)) {
            state.helpHl = n
        } else {

        }
    },
    helpShipConstChange (state, n) {
        n = parseInt(n)
        if (!isNaN(n)) {
            state.helpShipConst = n
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
