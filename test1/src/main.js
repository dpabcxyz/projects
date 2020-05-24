// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth){
//     if(localStorage.getItem('userName898')){
//       console.log(localStorage.getItem('userName100'))
//       next();
//     }
//     else{
//       next('/main')
//     }
//   }
//   else{
//     next()
//   }
// });


// router.beforeEach((to, from, next) => {
//   if(to.matched.some(record=>record.meta.requireAuth)){
//     if(localStorage.getItem('userName898')){
//       // console.log(localStorage.getItem('userName100'))
//       next();
//     }
//     else{
//       next('/main')
//     }
//   }
//   else{
//     next()
//   }
// });


router.beforeEach((to, from, next) => {
  if(to.matched.some((record)=>{
     return record.meta.requireAuth
  })){
    if(localStorage.getItem('userName898')){
      // console.log(localStorage.getItem('userName100'))
      next();
    }
    else{
      next('/main')
    }
  }
  else{
    next()
  }
});



