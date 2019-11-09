import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'
import ServError from './views/ServError.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/error',
      name: 'serv_error',
      component: ServError
    },
    {
      path: '/404',
      name: 'not_found',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
