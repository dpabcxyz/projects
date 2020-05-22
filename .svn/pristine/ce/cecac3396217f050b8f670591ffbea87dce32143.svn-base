import storage from 'plugins/localstorage'
const state = {
    user: {
    }
}

const getters = {
    getUserInfo: (state) => {
        return state.user
    },
    userId: (state) => {
        return state.user.userId
    }
}

const actions = {}

const mutations = {
    setUserInfo (state, payload) {
        if (payload.userId) {
            state.user = payload
            storage.set('user', payload)
        } else {
            storage.remove('user', payload)
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
