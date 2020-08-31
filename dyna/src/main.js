// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  // axios.defaults.baseURL
  if(localStorage.getItem('url')){
    this.$axios({
      url:'serverconfig.json',
      method:'get'
    })
    .then((res)=>{
      console.log(res.data);
      localStorage.setItem('url',res.data.baseUrl);
      this.$axios.defaults.baseURL=localStorage.getItem('url');
      next()
    })
  }
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
