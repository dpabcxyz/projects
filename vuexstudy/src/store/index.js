import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);



import getters from './getters'
import test from './modules/test.js'
import namespace from './modules/namespace.js'
export default new Vuex.Store({
    getters,
    modules:{
        test:test,
        namespace:namespace
        
    }
})