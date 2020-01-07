import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'
import ServError from './views/ServError.vue'
import AdminLogin from './views/AdminLogin.vue'
import Login from './views/Login.vue'
import RenewAccount from './views/RenewAccount.vue'
import Signup from './views/SignUp.vue'

Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (localStorage.accessToken) return next()
  next({
    path: '/',
    query: {
      redirect: to.fullPath
    }
  })
}

const alreadySignedIn = (to, from, next) => {
  if (localStorage.accessToken) next({ path: '/home' })
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      // beforeEnter: alreadySignedIn
    },
    {
      path: '/auth/gate/manager/login',
      name: 'admin_login',
      component: AdminLogin
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      beforeEnter: requireAuth
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
      path: '/auth/reset',
      name: 'reset',
      component: RenewAccount
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
