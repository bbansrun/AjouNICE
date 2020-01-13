import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

import './filters'

import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
Vue.prototype.$Axios = axios

const token = localStorage.getItem('accessToken')
if (token) {
  Vue.prototype.$Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
} else {
  Vue.prototype.$Axios.defaults.headers.common['Authorization'] = undefined
}

const apolloClient = new ApolloClient({
  link: createPersistedQueryLink({ useGETForHashedQueries: true }).concat(createHttpLink({ uri: `http://${require('ip').address()}:455/` })),
  cache: new InMemoryCache()
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
