import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })],
  state: {
    user: null,
    accessToken: null
  },
  mutations: {
    LOGIN (state, { result: { access_token } }) {
      state.accessToken = access_token
      Vue.prototype.$Axios.defaults.headers.common.Authorization = `Bearer ${access_token}`
    },
    LOGOUT (state) {
      state.user = null
      state.accessToken = null
      delete Vue.prototype.$Axios.defaults.headers.common.Authorization
    },
    verifiedToken (state, payload) {
      state.user = payload.user
    }
  },
  actions: {
    LOGIN ({ commit }, { userId, password }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$Axios({
          url: '/api/auth/login',
          method: 'POST',
          data: {
            userId: userId,
            password: password
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
    },
    checkTokenStatus ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (!state.user) {
          Vue.prototype.$Axios({
            url: '/api/protected',
            method: 'GET'
          }).then(({ data }) => {
            // Completely Decoded
            commit('verifiedToken', data)
            resolve(data)
          }).catch(error => {
            // Expired or etc,.
            commit('LOGOUT')
            reject(error)
          })
        } else {
          // Validate possessed token
          jwt.verify(state.accessToken, '4j0uN1ce1', (err, decoded) => {
            if (err) {
              commit('LOGOUT')
              reject(err)
            } else {
              resolve(decoded)
            }
          })
        }
      })
    }
  }
})
