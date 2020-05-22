// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import L from './assets/extend/leaflet/leaflet.js'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet' 
Vue.L = Vue.prototype.$L = L 
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
