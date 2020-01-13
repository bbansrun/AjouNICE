import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/base/Home.vue'
import About from './views/base/About.vue'
import ErrorPage from './views/base/ErrorPage.vue'
import Policy from './views/base/Policy.vue'
import Contact from './views/base/Contact.vue'
import AdminLogin from './views/auth/AdminLogin.vue'
import Login from './views/auth/Login.vue'
import RenewAccount from './views/auth/RenewAccount.vue'
import Signup from './views/auth/SignUp.vue'
import Unauthorized from './views/auth/Unauthorized.vue'
import Authorize from './views/auth/Authorize.vue'
import Board from './views/board/Board.vue'
import PostView from './views/board/View.vue'
import Edit from './views/board/Edit.vue'
import Dashboard from './views/admin/Dashboard.vue'
import Profile from './views/user/Profile.vue'
import ProfileEdit from './views/user/Edit.vue'

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
      path: '/board',
      component: Board,
      beforeEnter: requireAuth
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
      path: '/board/:category/:name/:post_id/view',
      component: PostView,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/:name/new',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/:name/:post_id/edit',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/profile/:user_id/',
      component: Profile,
      beforeEnter: requireAuth
    },
    {
      path: '/profile/:user_id/edit',
      component: ProfileEdit,
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
      component: Dashboard,
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
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy
    },
    {
      path: '/auth/reset',
      name: 'reset',
      component: RenewAccount
    },
    {
      path: '/error/:code',
      name: 'error_by_code',
      component: ErrorPage
    },
    {
      path: '*',
      redirect: '/error/404'
    }
  ]
})
