import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import {
  Home,
  Sitemap,
  About,
  ErrorPage,
  Policy,
  Contact,
  Board,
  BoardSearch,
  BoardView,
  BoardNew,
  BoardEditor,
  AuthTemplate,
  Login,
  Reset,
  SignUp,
  Recovery,
  AdminNotice,
  AdminNewNotice,
  AdminEditNotice,
  AdminNewCode,
  AdminCode,
  AdminEditCode,
  AdminDashboard,
  AdminStatus,
  AdminUsers,
  AdminEditBoard,
  AdminBoards,
  AdminBoardList,
  AdminNewBoard,
  AdminGourmet,
  AdminGourmetList,
  AdminNewGourmet,
  AdminEditGourmet,
  AdminNewGourmetPlace,
  AdminEditGourmetPlace,
  AdminReviews,
  AdminNewPopup,
  AdminPopup,
  AdminPermission,
  AdminRestriction,
  AdminRealty,
  ScheduleHome,
  TimetableHome,
  RealtyHome,
  RestaurantHome,
  GourmetHome,
  GourmetList,
  GourmetSearch,
  GourmetView,
  ReviewHome,
  ReviewView,
  ReviewEditor,
  UserProfile,
  UserEdit,
  UserReviews
} from '@/views'

import Invitation from '@/views/base/Invitation.vue'
import AdminLogin from '@/views/auth/AdminLogin.vue'
import Authorize from '@/views/auth/Authorize.vue'
import BusStation from '@/views/place/bus/BusStation.vue'
import LibraryHome from '@/views/place/library/Home.vue'

Vue.use(Router)

const checkHomeSignedIn = (to, from, next) => {
  if (store.state.accessToken) {
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
  if (store.state.accessToken) {
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
  if (store.state.accessToken) {
    store.dispatch('checkTokenStatus').then(({ user }) => {
      if (user.managable) {
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
  if (!store.state.accessToken) return next()
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
      path: '/auth',
      component: AuthTemplate,
      children: [
        {
          path: 'login',
          component: Login,
          beforeEnter: alreadySignedIn
        },
        {
          path: 'signup',
          component: SignUp
        },
        {
          path: 'recovery',
          component: Recovery
        },
        {
          path: 'authorize',
          component: Authorize
        },
        {
          path: 'authorize/reset',
          component: Reset
        }
      ]
    },
    {
      path: '/my/edit',
      component: UserEdit,
      beforeEnter: requireAuth
    },
    {
      path: '/invitation',
      component: Invitation
    },
    {
      path: '/lectures',
      component: ReviewHome,
      beforeEnter: requireAuth
    },
    {
      path: '/lectures/evaluate',
      component: ReviewEditor,
      beforeEnter: requireAuth
    },
    {
      path: '/lectures/:id/review',
      component: ReviewView,
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
      component: BoardNew,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:post_id/view',
      component: BoardView,
      beforeEnter: requireAuth
    },
    {
      path: '/board/:post_id/edit',
      component: BoardEditor,
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
      path: '/my',
      component: UserProfile,
      beforeEnter: requireAuth
    },
    {
      path: '/my/lectures/reviews',
      component: UserReviews,
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
      component: GourmetHome,
      beforeEnter: requireAuth
    },
    {
      path: '/place/gourmet/:category',
      component: GourmetList,
      beforeEnter: requireAuth
    },
    {
      path: '/place/gourmet/:post_id/view',
      component: GourmetView,
      beforeEnter: requireAuth
    },
    {
      path: '/place/gourmet/search',
      component: GourmetSearch,
      beforeEnter: requireAuth
    },
    {
      path: '/gate/manager/auth/login',
      component: AdminLogin
    },
    {
      path: '/gate/manager',
      component: AdminDashboard,
      beforeEnter: requireAdminAuth,
      children: [
        {
          path: '',
          component: AdminStatus
        },
        {
          path: 'notice',
          component: AdminNotice
        },
        {
          path: 'notice/:notice_idx/edit',
          component: AdminEditNotice
        },
        {
          path: 'notice/new',
          component: AdminNewNotice
        },
        {
          path: 'users',
          component: AdminUsers
        },
        {
          path: 'codes',
          component: AdminCode
        },
        {
          path: 'codes/new',
          component: AdminNewCode
        },
        {
          path: 'codes/edit/:record',
          component: AdminEditCode
        },
        {
          path: 'boards',
          component: AdminBoards
        },
        {
          path: 'boards/new',
          component: AdminNewBoard
        },
        {
          path: 'boards/gourmet',
          component: AdminGourmet
        },
        {
          path: 'boards/gourmet/new/module',
          component: AdminNewGourmet
        },
        {
          path: 'boards/gourmet/new/place',
          component: AdminNewGourmetPlace
        },
        {
          path: 'boards/gourmet/:category_idx',
          component: AdminGourmetList
        },
        {
          path: 'boards/gourmet/:category_idx/edit',
          component: AdminEditGourmet
        },
        {
          path: 'boards/gourmet/:category_idx/place/:res_idx/edit',
          component: AdminEditGourmetPlace
        },
        {
          path: 'boards/reviews',
          component: AdminReviews
        },
        {
          path: 'boards/realty',
          component: AdminRealty
        },
        {
          path: 'boards/:category_idx',
          component: AdminBoardList
        },
        {
          path: 'boards/:category_idx/edit',
          component: AdminEditBoard
        },
        {
          path: 'restrictions',
          component: AdminRestriction
        },
        {
          path: 'permissions',
          component: AdminPermission
        },
        {
          path: 'popups',
          component: AdminPopup
        },
        {
          path: 'popups/new',
          component: AdminNewPopup
        }
      ]
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
