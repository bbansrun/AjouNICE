import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/base/Home.vue'
import Sitemap from './views/base/Sitemap.vue'
import About from './views/base/About.vue'
import ErrorPage from './views/base/ErrorPage.vue'
import Policy from './views/base/Policy.vue'
import Contact from './views/base/Contact.vue'
import AdminLogin from './views/auth/AdminLogin.vue'
import Login from './views/auth/Login.vue'
import RenewAccount from './views/auth/RenewAccount.vue'
import Modifier from './views/auth/ModifyAccount.vue'
import Signup from './views/auth/SignUp.vue'
import Authorize from './views/auth/Authorize.vue'
import Board from './views/board/Board.vue'
import PostView from './views/board/View.vue'
import Edit from './views/board/Edit.vue'
import Dashboard from './views/admin/Dashboard.vue'
import Profile from './views/user/Profile.vue'
import BusStation from './views/place/BusStation.vue'
import Gourmet from './views/place/gourmet/Home.vue'
import GourmetList from './views/place/gourmet/List.vue'
import LectureHome from './views/function/lecture/Home.vue'
import ScheduleHome from './views/function/schedule/Home.vue'
import Invitation from './views/base/Invitation.vue'

import store from './store.js'

Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (localStorage.accessToken) {
    store.dispatch('checkTokenStatus').then(result => {
      return next()
    }).catch(error => {
      if (error.name === 'TokenExpiredError') {
        Vue.prototype.$flashStorage.flash('로그인 만료! 다시 로그인해주시기 바랍니다.', 'warning', {
          timeout: 3000
        })
      }
      return next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    })
  } else {
    Vue.prototype.$flashStorage.flash('서비스 이용을 위해 로그인해주시기 바랍니다.', 'info', {
      timeout: 3000
    })
    return next({
      path: '/',
      query: {
        redirect: to.fullPath
      }
    })
  }
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
  if (!localStorage.accessToken) return next()
  next({
    path: '/home'
  })
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      beforeEnter: alreadySignedIn
    },
    {
      path: '/invitation',
      component: Invitation
    },
    {
      path: '/lectures',
      component: LectureHome,
      beforeEnter: requireAuth
    },
    {
      path: '/schedule',
      component: ScheduleHome,
      beforeEnter: requireAuth
    },
    {
      path: '/sitemap',
      component: Sitemap
    },
    {
      path: '/board',
      component: Board,
      beforeEnter: requireAuth
    },
    {
      path: '/board/new',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category',
      component: Board,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/new',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/:name',
      component: Board,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:category/:name/new',
      component: Edit,
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
      component: Modifier,
      beforeEnter: requireAuth
    },
    {
      path: '/place/bus',
      component: BusStation,
      beforeEnter: requireAuth
    },
    {
      path: '/place/gourmet',
      component: Gourmet,
      beforeEnter: requireAuth
    },
    {
      path: '/place/gourmet/:category',
      component: GourmetList,
      beforeEnter: requireAuth
    },
    {
      path: '/auth/authorize',
      name: 'authorize',
      component: Authorize
    },
    {
      path: '/auth/reset/authorize',
      component: Modifier
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
  ],
  scrollBehavior () {
    window.scrollTo(0, 0)
  }
})
