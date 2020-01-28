import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null
  },
  mutations: {
    LOGIN (state, { result }) {
      state.accessToken = result.access_token
      localStorage.setItem('accessToken', result.access_token)
      Vue.prototype.$Axios.defaults.headers.common.Authorization = `Bearer ${result.access_token}`
    },
    LOGOUT (state) {
      state.accessToken = null
      localStorage.removeItem('accessToken')
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
