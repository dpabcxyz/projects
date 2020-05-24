import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import Page1 from '@/pages/page1'
import Page2 from '@/pages/page2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/page1',
      name: 'Page1',
      component: Page1,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/page2',
      name: 'Page2',
      component: Page2
    }
  ],
  mode: 'history'
})
