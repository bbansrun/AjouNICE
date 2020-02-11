import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

import './filters'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSignOutAlt,
  faUser,
  faPen,
  faPlus,
  faUpload,
  faKey,
  faArrowAltCircleRight,
  faEye,
  faStar,
  faSearchPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueCarousel from '@chenfengyuan/vue-carousel'
import VueFeather from 'vue-feather'
import VueFlashMessage from 'vue-flash-message'

import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)
Vue.use(VueCarousel)
Vue.use(VueFeather)
Vue.use(VueFlashMessage, {
  createShortcuts: true,
  messageOptions: {
    timeout: 1000,
    important: true,
    autoEmit: true,
    pauseOnInteract: true
  }
})

Vue.prototype.$Axios = axios
const token = localStorage.getItem('accessToken')
if (token) {
  Vue.prototype.$Axios.defaults.headers.common.Authorization = `Bearer ${token}`
} else {
  Vue.prototype.$Axios.defaults.headers.common.Authorization = undefined
}

library.add(faSignOutAlt)
library.add(faUser)
library.add(faPen)
library.add(faPlus)
library.add(faKey)
library.add(faArrowAltCircleRight)
library.add(faUpload)
library.add(faEye)
library.add(faStar)
library.add(faSearchPlus)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const shouldEncode = (url, options) => {
  if (process.env.NODE_ENV === 'development') return false // dev 환경에서는 안함
  if (!options.method || options.method.toLowerCase() !== 'post') return false // post method가 아닐 경우 안함
  url = url.split('?')[0].split('#')[0]
  if (!url.endsWith('/graphql')) return false // graphql 요청이 아닐 경우에도 안함
  return true
}

const encodeTextBody = async (text, key, iv) => {
  let buffer = new Uint8Array(new TextEncoder().encode(text))
  buffer = await self.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    buffer
  )
  return buffer
}

const decodeTextBody = async (text, key, iv) => {
  let buffer = new Uint8Array(
    [...atob(text)].map(char => char.charCodeAt(0))
  )
  buffer = await self.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    buffer
  )
  return buffer
}

const encryptedFetchImplementation = async (url, options) => {
  const isEncoding = shouldEncode(url, options)
  let isCrypting = false
  const iv = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  const key = await self.crypto.subtle.importKey(
    'jwk', {
      kty: 'oct',
      kid: 'b48e9af0-34c1-4179-9ee3-c2ccab3c2786',
      k: 'Qtisu1fz9NZ0lTsBfTD8hMqRTWJnnpdqhDXGNwUoPfI',
      alg: 'A256GCM'
    },
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
  options = options || {}
  options.method = options.method || 'GET'
  if (isEncoding) {
    options.headers['Content-Type'] = 'text/plain; charset=UTF-8'
    options.headers['Content-Transfer-Encoding'] = 'base64'
    options.body = encodeTextBody(options.body, key, iv)
    isCrypting = true
  }
  // options.credentials == 'include'  자격 증명 인증서 포함
  const res = await fetch(url, options)
  const responseText = res.body
  if (isCrypting) {
    res.text = await decodeTextBody(responseText, key, iv)
    res.json = JSON.parse(await decodeTextBody(responseText, key, iv))
  }
  return res
}

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:455/graphql',
  options: {
    reconnect: true
  }
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }))
  return forward(operation)
})

const httpLink = authLink.concat(createPersistedQueryLink({ useGETForHashedQueries: true })
  .concat(createHttpLink({
    uri: `http://${require('ip').address()}:455/graphql`,
    fetch: encryptedFetchImplementation
  })))

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink, // Websocket Link
  httpLink // Http Link
)

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
