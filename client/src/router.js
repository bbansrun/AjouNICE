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
import Unauthorized from './views/Unauthorized.vue'
import Authorize from './views/Authorize.vue'
import Board from './views/Board.vue'

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

const requireAdminAuth = (to, from, next) => {
  if (localStorage.accessToken) return next()
  next({
    path: '/gate/manager/auth/login',
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
      component: Login
    },
    {
      path: '/board/:category',
      component: Board,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/:name',
      component: Board,
      beforeEnter: requireAuth
    },
    {
      path: '/auth/authorize',
      name: 'authorize',
      component: Authorize
    },
    {
      path: '/auth/unauthorized',
      name: 'unauthorized',
      component: Unauthorized
    },
    {
      path: '/gate/manager/auth/login',
      name: 'admin_login',
      component: AdminLogin
    },
    {
      path: '/gate/manager',
      name: 'admin',
      beforeEnter: requireAdminAuth
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
      path: '/auth/reset',
      name: 'reset',
      component: RenewAccount
    },
    {
      path: '/error/404',
      name: 'not_found',
      component: NotFound
    },
    {
      path: '/error/500',
      name: 'serv_error',
      component: ServError
    },
    {
      path: '*',
      redirect: '/error/404'
    }
  ]
})
