import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import './filters'

// Vendors
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSignOutAlt,
  faUser,
  faUsers,
  faUserCog,
  faUsersCog,
  faUserLock,
  faPen,
  faPlus,
  faUpload,
  faKey,
  faArrowAltCircleRight,
  faEye,
  faStar,
  faSearchPlus,
  faTrash,
  faStickyNote,
  faHome,
  faReply,
  faThList,
  faCopy,
  faExclamationTriangle,
  faTimes,
  faEnvelopeOpenText,
  faUserPlus,
  faInfoCircle,
  faCheck,
  faComments,
  faList,
  faArrowUp,
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faTag,
  faCog,
  faQuestion,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueApollo from 'vue-apollo'
import VueCarousel from '@chenfengyuan/vue-carousel'
import VueFeather from 'vue-feather'
import VueFlashMessage from 'vue-flash-message'
import Buefy from 'buefy'
import vSelect from 'vue-select'
import InfiniteLoading from 'vue-infinite-loading'
import VueSweetalert2 from 'vue-sweetalert2'
import CKEditor from '@ckeditor/ckeditor5-vue'
import Gravatar from 'vue-gravatar'

import 'vue-flash-message/dist/vue-flash-message.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import { ApolloClient } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'

library.add(faSignOutAlt)
library.add(faUser)
library.add(faUsers)
library.add(faUserCog)
library.add(faUsersCog)
library.add(faUserLock)
library.add(faPen)
library.add(faPlus)
library.add(faKey)
library.add(faArrowAltCircleRight)
library.add(faUpload)
library.add(faEye)
library.add(faStar)
library.add(faSearchPlus)
library.add(faTrash)
library.add(faStickyNote)
library.add(faHome)
library.add(faReply)
library.add(faThList)
library.add(faExclamationTriangle)
library.add(faCopy)
library.add(faTimes)
library.add(faEnvelopeOpenText)
library.add(faUserPlus)
library.add(faInfoCircle)
library.add(faCheck)
library.add(faComments)
library.add(faList)
library.add(faArrowUp)
library.add(faArrowDown)
library.add(faAngleLeft)
library.add(faAngleRight)
library.add(faTag)
library.add(faCog)
library.add(faQuestion)
library.add(faTimesCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('v-gravatar', Gravatar)
Vue.component('v-select', vSelect)
Vue.use(Buefy, {
  defaultIconComponent: 'font-awesome-icon',
  defaultIconPack: 'fas'
})
Vue.use(InfiniteLoading)
Vue.use(VueApollo)
Vue.use(VueCarousel)
Vue.use(VueFeather)
Vue.use(VueSweetalert2, {
  width: '90vw',
  confirmButtonColor: '#00A8CC',
  cancelButtonColor: '#FF2E63',
  confirmButtonText: '확인',
  cancelButtonText: '취소',
  allowOutsideClick: false
})
Vue.use(VueFlashMessage, {
  createShortcuts: true,
  messageOptions: {
    timeout: 1000,
    important: true,
    autoEmit: true,
    pauseOnInteract: true
  }
})
Vue.use(CKEditor)

Vue.prototype.$Axios = axios
const token = localStorage.getItem('accessToken')
if (token) {
  Vue.prototype.$Axios.defaults.headers.common.Authorization = `Bearer ${token}`
} else {
  Vue.prototype.$Axios.defaults.headers.common.Authorization = undefined
}

const shouldEncode = (url, options) => {
  // if (process.env.NODE_ENV === 'development') return false
  if (!options.method || options.method.toLowerCase() !== 'post') return false
  url = url.split('?')[0].split('#')[0]
  if (!url.endsWith('/graphql')) return false
  return true
}

const encodeTextBody = (text) => {
  const buffer = new Uint8Array(new TextEncoder().encode(text))
  return btoa(unescape(encodeURIComponent(String.fromCharCode.apply(null, buffer))))
}

const decodeTextBody = (text) => {
  const buffer = new Uint8Array(
    [...atob(text)].map(char => char.charCodeAt(0))
  )
  return new TextDecoder().decode(buffer)
}

const response = (req) => {
  const isCrypting = true
  const keys = []; const all = []; const headers = {}; let header

  req.getAllResponseHeaders()
    .replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
      keys.push((key = key.toLowerCase()))
      all.push([key, value])
      header = headers[key]
      headers[key] = header ? `${header},${value}` : value
    })

  return {
    ok: ((req.status / 200) | 0) === 1,
    status: req.status,
    statusText: req.statusText,
    url: req.responseURL,
    clone: response,
    text: async () => (isCrypting
      ? await decodeTextBody(req.responseText)
      : req.responseText
    ),
    json: async () => JSON.parse(isCrypting
      ? await decodeTextBody(req.responseText)
      : req.responseText
    ),
    blob: () => Promise.resolve(new Blob([req.response])),
    headers: {
      keys: () => keys,
      entries: () => all,
      get: n => headers[n.toLowerCase()],
      has: n => n.toLowerCase() in headers
    }
  }
}

const fetch = (url, options) => {
  options = options || {}
  const isEncoding = shouldEncode(url, options)
  return new Promise(async (resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open(options.method || 'get', url)
    for (const i in options.headers) {
      if (isEncoding && i.toLowerCase() === 'content-type') {
        req.setRequestHeader(i, 'text/plain; charset=UTF-8')
        req.setRequestHeader('Content-Transfer-Encoding', 'base64')
      } else {
        req.setRequestHeader(i, options.headers[i])
      }
    }
    req.withCredentials = options.credentials === 'include'
    req.onload = () => {
      resolve(response(req))
    }
    req.onerror = reject

    const body = options.body
    req.send(isEncoding ? await encodeTextBody(body) : body)
  })
}

const wsLink = new WebSocketLink({
  uri: `ws://${require('ip').address()}:455/graphql`,
  options: {
    reconnect: true
  }
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      Authorization: `Bearer ${token}`
    }
  }))
  return forward(operation)
})

const uploadLink = authLink.concat(createUploadLink({
  uri: `http://${require('ip').address()}:455/graphql`
}))

const httpLink = uploadLink.concat(createPersistedQueryLink({ useGETForHashedQueries: true })
  .concat(createHttpLink({
    uri: `http://${require('ip').address()}:455/graphql`
    // fetch
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

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})
Vue.prototype.$Apollo = apolloClient

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
