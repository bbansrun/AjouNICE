import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('accessToken') || null
  },
  mutations: {
    LOGIN (state, { result }) {
      state.accessToken = result.access_token
      localStorage.setItem('accessToken', result.access_token)
    },
    LOGOUT (state) {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    }
  },
  actions: {
    LOGIN ({ commit }, { user_id, password }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$Axios({
          url: '/api/auth/login',
          method: 'POST',
          data: {
            'user_id': user_id,
            'password': password
          }
        }).then(({ data }) => {
          commit('LOGIN', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    LOGOUT ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT')
        resolve()
      })
    }
  }
})
