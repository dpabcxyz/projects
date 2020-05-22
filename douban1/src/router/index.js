import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

import Test from '../components/test.vue'

import Home from '../pages/Home/home.vue'
import Broadcast from '../pages/Broadcast/broadcast.vue'
import Audio from '../pages/Audio/audio.vue'
import Group from '../pages/Group/group.vue'
import Mine from '../pages/Mine/mine.vue'

import Film from '../components/film'
import Tv from '../components/tv'
import City from '../components/city'
import Read from '../components/read'
import Music from '../components/music'

Vue.use(Router)

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
      path: '/audio',
      name: 'Audio',
      component: Audio,
      children: [
        {path: '', component: Film},
        {path: 'film', component: Film},
        {path: 'tv', component: Tv},
        {path: 'city', component: City},
        {path: 'read', component: Read},
        {path: 'music', component: Music},
      ]
    },
    {
      path: '/broadcast',
      name: 'Broadcast',
      component: Broadcast
    },
    {
      path: '/group',
      name: 'Group',
      component: Group
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
  ]
})
