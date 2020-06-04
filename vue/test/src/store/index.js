import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import layout from './modules/layout.js'  //页面布局、动效
export default new Vuex.Store({
  modules: {
        layout: layout,
    }
})
