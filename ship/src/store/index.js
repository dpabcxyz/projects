import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import shipView from './modules/shipView'
import map from './modules/map'
import helpMessageComponent from './modules/helpMessageComponent'
import fleet from './modules/fleet'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user, shipView, map, fleet, helpMessageComponent
    },
    state: {
        language: (navigator.language || navigator.browserLanguage),
        displayWindowFleet: false,
        displayWindowInfo: false,
        displayWindowSearch: false,
        loading: false
    },
    mutations: {
        openWindowExclude (state, payload) {
            switch (payload) {
            case 'fleet':
                state.displayWindowFleet = true
                state.displayWindowInfo = false
                state.displayWindowSearch = false
                break
            case 'info':
                state.displayWindowFleet = false
                state.displayWindowInfo = true
                state.displayWindowSearch = false
                break
            case 'search':
                state.displayWindowFleet = false
                state.displayWindowInfo = false
                state.displayWindowSearch = true
                break

            default:
                break
            }
        },
        openWindow (state, payload) {
            switch (payload) {
            case 'fleet':
                state.displayWindowFleet = true
                break
            case 'info':
                state.displayWindowInfo = true
                break
            case 'search':
                state.displayWindowSearch = true
                break

            default:
                break
            }
        },
        closeWindowAll (state) {
            state.displayWindowFleet = false
            state.displayWindowInfo = false
            state.displayWindowSearch = false
        },

        closeWindow (state, payload) {
            switch (payload) {
            case 'fleet':
                state.displayWindowFleet = false
                break
            case 'info':
                state.displayWindowInfo = false
                break
            case 'search':
                state.displayWindowSearch = false
                break
            }
        },

        toggleWindow (state, payload) {
            switch (payload) {
            case 'fleet':
                state.displayWindowFleet = !state.displayWindowFleet
                break
            case 'info':
                state.displayWindowInfo = !state.displayWindowInfo
                break
            case 'search':
                state.displayWindowSearch = !state.displayWindowSearch
                break
            }
        },

        toggleWindowExclude (state, payload) {
            switch (payload) {
            case 'fleet':
                state.displayWindowFleet = !state.displayWindowFleet
                state.displayWindowInfo = false
                state.displayWindowSearch = false
                break
            case 'info':
                state.displayWindowFleet = !state.displayWindowFleet
                state.displayWindowInfo = true
                state.displayWindowSearch = false
                break
            case 'search':
                state.displayWindowFleet = !state.displayWindowFleet
                state.displayWindowInfo = false
                state.displayWindowSearch = true
                break
            }
        },
        loading (state, payload) {
            state.loading = payload
        }
    },
    getters: {
        language: (state) => state.language,
        displayWindowSearch: (state) => state.displayWindowSearch,
        displayWindowInfo: (state) => state.displayWindowInfo,
        displayWindowFleet: (state) => state.displayWindowFleet,
        loading: (state) => state.loading
    },
    actions: {
        toggleLoading ({ commit }, payload) {
            commit('loading', payload)
        }
    }
})
