import Vue from 'vue'
import axios from 'axios'
const state = {
    ok: false,
}
const getters = {
    ok: function() {
         return state.ok;
     },
}
const actions = {
    // setbaseURL({ commit }) {
    //      commit('setbaseURL');
    //  },
    ok({ commit, state },data) {
        commit('ok',data);
    },

}
const mutations = {
    // setbaseURL(state) {
    //      if (process.env.NODE_ENV === 'production') {
    //          axios.defaults.baseURL = localStorage.getItem('baseURL');
    //      }
    //  },
    ok(state, data) {
        state.ok=data;
        console.log(data)
    },
}
export default {
    state,
    getters,
    mutations,
    actions
}
