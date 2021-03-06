import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import China from './views/China.vue'
import Other from './views/Other.vue'
import Provincial from './views/Provincial.vue'
import Succession from './views/Succession.vue'
import City from './views/City.vue'

Vue.use(Router)

//解决省份报错 Uncaught (in promise) 问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/china',
      name: 'china',
      component: China
    },
    {
      path: '/other',
      name: 'other',
      component: Other      
    },
    {
      path:'/provincial',
      name:'provincial',
      component:Provincial
    },
    {
      path:'/city',
      name:'city',
      component:City
    },
    {
      path:'/home/succession',
      name:'succession',
      component:Succession
    },
  ]
})
