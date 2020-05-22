import Vue from 'vue'
import './utils/vue.filters'
import './utils/vue.directives'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import './plugins/iview.js'

import './api/axios'
// import api from './request/api'
import i18n from './i18n'
import 'normalize.css'
import './stylus/app.styl'
import SvgIcon from './components/SvgIcon.vue'
import '@babel/polyfill'
Vue.component('SvgIcon', SvgIcon)

Vue.config.productionTip = false
window.vue = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

// 热更新
if (module.hot) {
    module.hot.accept(['./locales/zh.json', './locales/en.json'], function () {
        i18n.setLocaleMessage('zh', require('./locales/zh.json').default)
        i18n.setLocaleMessage('en', require('./locales/en.json').default)
    })
}
