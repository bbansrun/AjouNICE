import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from './store'
import router from './router'

import './filters'

import Buefy from 'buefy'
import vSelect from 'vue-select'
import Gravatar from 'vue-gravatar'
import VueFeather from 'vue-feather'
import VueSweetalert2 from 'vue-sweetalert2'
import CKEditor from '@ckeditor/ckeditor5-vue'
import VueFlashMessage from 'vue-flash-message'
import InfiniteLoading from 'vue-infinite-loading'
import VueCarousel from '@chenfengyuan/vue-carousel'

// ApolloClient
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'

// Component Styles
import 'vue-flash-message/dist/vue-flash-message.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

// Font-awesome
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

// JWT Token (Authentication / Authorization)
let token
const tokenExists = store.state.accessToken

// Component Option Variables
const buefyOptions = {
  defaultIconComponent: 'font-awesome-icon',
  defaultIconPack: 'fas'
}

const sweetalert2Options = {
  width: '90vw',
  confirmButtonColor: '#00A8CC',
  cancelButtonColor: '#FF2E63',
  confirmButtonText: '확인',
  cancelButtonText: '취소',
  allowOutsideClick: false
}

const flashMessageOptions = {
  createShortcuts: true,
  messageOptions: {
    timeout: 1000,
    important: true,
    autoEmit: true,
    pauseOnInteract: true
  }
}

// Font-awesome Libraries
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

Vue.use(CKEditor)
Vue.use(VueApollo)
Vue.use(VueFeather)
Vue.use(VueCarousel)
Vue.use(InfiniteLoading)
Vue.use(Buefy, buefyOptions)
Vue.use(VueSweetalert2, sweetalert2Options)
Vue.use(VueFlashMessage, flashMessageOptions)

// Axios
Vue.prototype.$Axios = axios
if (tokenExists) {
  token = `Bearer ${tokenExists}`
  Vue.prototype.$Axios.defaults.headers.common.Authorization = token
} else {
  token = null
  Vue.prototype.$Axios.defaults.headers.common.Authorization = undefined
}

// Apollo Client
const link = ApolloLink.from([
  // Upload Link
  createUploadLink({
    uri: `http://${require('ip').address()}:455/graphql`
  }),
  split(
    // Subscription
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    // Persisted Query Link
    createPersistedQueryLink({
      useGETForHashedQueries: true
    }),
    // WebSocket Link
    new WebSocketLink({
      uri: `ws://${require('ip').address()}:455/graphql`,
      options: {
        reconnect: true
      }
    }),
    // HTTP Link
    createHttpLink({
      uri: `http://${require('ip').address()}:455/graphql`
    })
  )
])

const defaultClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

Vue.prototype.$Apollo = defaultClient

const apolloProvider = new VueApollo({
  defaultClient
})

Vue.config.productionTip = false
new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
