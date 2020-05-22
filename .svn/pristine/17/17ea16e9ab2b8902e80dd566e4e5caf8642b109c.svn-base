import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home/home'
import Group from '../pages/Group/group'
import Mine from '../pages/Mine/mine'
import Broadcast from '../pages/Broadcast/broadcast'
import Audio from '../pages/Audio/audio'

import Film from '../pages/Audio/tab/film'
import Read from '../pages/Audio/tab/read'
import Music from '../pages/Audio/tab/music'
import City from '../pages/Audio/tab/city'
import Tv from '../pages/Audio/tab/tv'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
      {
      path: '/home',
      name: 'Home',
      component: Home
    },
      {
      path: '/group',
      name: 'Group',
      component: Group
    },
      {
      path: '/audio',
      name: 'Audio',
      component: Audio,
        children:[
          {
            path:'/',component:Film
          },
          {
            path:'film',component:Film
          },
          {
            path:'tv',component:Tv
          },
          {
            path:'read',component:Read
          },
          {
            path:'city',components:City
          },
          {
            path:'music',component:Music
          }
        ]
    },
      {
      path: '/broadcast',
      name: 'Broadcast',
      component: Broadcast
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    }

  ]
})
