import Vue from 'vue'
import Router from 'vue-router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import storage from './plugins/localstorage'
import store from './store/index'

Vue.use(Router)
let isgetLocalUser = false
const router = new Router({
    mode: 'hash', //
    base: process.env.BASE_URL,
    routes: [{
        path: '/login',
        name: 'login',
        component: () => import('./views/login.vue')
    }, {
        path: '/',
        component: () => import('./views/index.vue'),
        children: [{
            path: '',
            components: {
                mapview: () => import('./components/map.vue')
            }
        }, {
            path: 'map',
            name: 'map',
            components: {
                mapview: () => import('./components/map.vue')
            }
        }, {
            path: 'ship',
            name: 'ship',
            components: {
                mapview: () => import('./components/shipManage.vue')
            }
        }, {
            path: 'ship/:shipId',
            name: 'shipInfo',
            components: {
                mapview: () => import('./components/shipInfo.vue')
            }
        }]
    }, {
        path: '/callcenter',
        name: 'call',
        component: () => import('./views/callCenter.vue')
    }, {
        path: '*',
        name: '404',
        component: () => import('./views/Error.vue')
    }]
})

router.beforeEach((to, from, next) => {
    Nprogress.start()
    // console.log(to, from)
    if (!storage.get('user')) {
        if (to.path === '/login') {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        if (!isgetLocalUser) {
            isgetLocalUser = true
            let user = storage.get('user')
            store.commit('user/setUserInfo', user)
        }
        if (to.path === '/login') {
            console.log(store)
            next({
                path: '/map'
            })
        } else {
            next()
        }
    }
})

router.afterEach(route => {
    Nprogress.done()
})

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}
export default router
