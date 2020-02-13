import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'

import Home from '@/views/base/Home.vue'
import Sitemap from '@/views/base/Sitemap.vue'
import About from '@/views/base/About.vue'
import ErrorPage from '@/views/base/ErrorPage.vue'
import Policy from '@/views/base/Policy.vue'
import Contact from '@/views/base/Contact.vue'
import Invitation from '@/views/base/Invitation.vue'

import AdminLogin from '@/views/auth/AdminLogin.vue'
import Login from '@/views/auth/Login.vue'
import RenewAccount from '@/views/auth/RenewAccount.vue'
import Modifier from '@/views/auth/ModifyAccount.vue'
import Signup from '@/views/auth/SignUp.vue'
import Authorize from '@/views/auth/Authorize.vue'

import Board from '@/views/board/Board.vue'
import BoardSearch from '@/views/board/Search.vue'
import PostView from '@/views/board/View.vue'
import Edit from '@/views/board/Edit.vue'

import Dashboard from '@/views/admin/Dashboard.vue'
import AdminStatus from '@/views/admin/Status.vue'
import AdminUsers from '@/views/admin/Users.vue'
import AdminBoards from '@/views/admin/Boards.vue'

import Profile from '@/views/user/Profile.vue'
import LectureReviews from '@/views/user/LectureReviews.vue'

import BusStation from '@/views/place/bus/BusStation.vue'
import Gourmet from '@/views/place/gourmet/Home.vue'
import GourmetList from '@/views/place/gourmet/List.vue'

import LectureHome from '@/views/function/lecture/Home.vue'
import LectureReview from '@/views/function/lecture/Review.vue'
import LectureEvaluation from '@/views/function/lecture/Evaluation.vue'

import ScheduleHome from '@/views/function/schedule/Home.vue'

import TimetableHome from '@/views/function/timetable/Home.vue'

import RealtyHome from '@/views/place/realty/Home.vue'

import LibraryHome from '@/views/place/library/Home.vue'

import RestaurantHome from '@/views/place/restaurant/Home.vue'

Vue.use(Router)

const checkHomeSignedIn = (to, from, next) => {
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
        path: '/auth/login',
        query: {
          redirect: to.fullPath
        }
      })
    })
  } else {
    next()
  }
}

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
        path: '/auth/login',
        query: {
          redirect: to.fullPath
        }
      })
    })
  } else {
    Vue.prototype.$flashStorage.flash('서비스 이용을 위해 로그인해주시기 바랍니다.', 'warning', {
      timeout: 3000
    })
    return next({
      path: '/auth/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
}

const requireAdminAuth = (to, from, next) => {
  if (localStorage.accessToken) {
    store.dispatch('checkTokenStatus').then(({ user }) => {
      if (user.type === 'A') {
        return next()
      } else {
        return next({
          path: '/error/404'
        })
      }
    }).catch(error => {
      if (error.name === 'TokenExpiredError') {
        Vue.prototype.$flashStorage.flash('로그인 만료! 다시 로그인해주시기 바랍니다.', 'warning', {
          timeout: 3000
        })
      }
      return next({
        path: '/gate/manager/auth/login',
        query: {
          redirect: to.fullPath
        }
      })
    })
  } else {
    next()
  }
}

const alreadySignedIn = (to, from, next) => {
  if (!localStorage.accessToken) return next()
  next({
    path: '/'
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: checkHomeSignedIn
    },
    {
      path: '/auth/login',
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
      path: '/lectures/evaluate',
      component: LectureEvaluation,
      beforeEnter: requireAuth
    },
    {
      path: '/lectures/:id/review',
      component: LectureReview,
      beforeEnter: requireAuth
    },
    {
      path: '/schedule',
      component: ScheduleHome
    },
    {
      path: '/timetable',
      component: TimetableHome
    },
    {
      path: '/restaurant',
      component: RestaurantHome
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
      path: '/board/search',
      component: BoardSearch,
      beforeEnter: requireAuth
    },
    {
      path: '/board/new',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:post_id/view',
      component: PostView,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:post_id/edit',
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
      path: '/board/:category/:name/new',
      component: Edit,
      beforeEnter: requireAuth
    },
    {
      path: '/my',
      component: Profile,
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
      path: '/profile/:user_id/lectures/reviews',
      component: LectureReviews,
      beforeEnter: requireAuth
    },
    {
      path: '/place/bus',
      component: BusStation
    },
    {
      path: '/place/realty',
      component: RealtyHome
    },
    {
      path: '/place/library',
      component: LibraryHome
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
      component: AdminLogin
    },
    {
      path: '/gate/manager',
      component: Dashboard,
      beforeEnter: requireAdminAuth,
      children: [
        {
          path: '',
          component: AdminStatus
        },
        {
          path: 'users',
          component: AdminUsers
        },
        {
          path: 'boards',
          component: AdminBoards
        }
      ]
    },
    {
      path: '/auth/signup',
      component: Signup
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/contact',
      component: Contact
    },
    {
      path: '/policy',
      component: Policy
    },
    {
      path: '/auth/reset',
      component: RenewAccount
    },
    {
      path: '/error/:code',
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
