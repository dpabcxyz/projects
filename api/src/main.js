// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from "./store/index.js"
import PreResources from './preResources/index'
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.PreResources = PreResources;
router.beforeEach((to, from, next) => {
   // store.state.layout.ok=true;
   // console.log(store.state.layout.ok)
   // store.dispatch('ok',true)
  if(process.env.NODE_ENV === 'production'){
      var d = new Date();
      axios({
        url:'serverconfig.json',
        method:'get'
      })
      .then((res)=>{
        localStorage.setItem('url',res.data.baseUrl);
        axios.defaults.baseURL=localStorage.getItem('url');
        PreResources.hehe1(axios.defaults.baseURL);
        next()
      })
      .catch(()=>{
        next()
      })
  }
  else{
    next()
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
