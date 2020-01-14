import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

import './filters'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faUser, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import CKEditor from '@ckeditor/ckeditor5-vue'

import VueCarousel from '@chenfengyuan/vue-carousel'
import VueFeather from 'vue-feather'

import {ServerTable, ClientTable, Event} from 'vue-tables-2'

import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
Vue.use(CKEditor)
Vue.use(VueCarousel)
Vue.use(VueFeather)

Vue.prototype.$Axios = axios
const token = localStorage.getItem('accessToken')
if (token) {
  Vue.prototype.$Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
} else {
  Vue.prototype.$Axios.defaults.headers.common['Authorization'] = undefined
}

library.add(faSignOutAlt)
library.add(faUser)
library.add(faPen)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
