import Vue from 'vue'
import Router from 'vue-router'
import { requireAuth } from './utils/navigation-guard'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/room',
      name: 'room',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "room" */ './views/Room.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/game',
      name: 'game',
      component: () =>
        import(/* webpackChunkName: "game" */ './views/Game.vue'),
      beforeEnter: requireAuth,
    },
  ],
})
