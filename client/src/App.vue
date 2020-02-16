<template>
  <div id="app">
    <Loading />
    <flash-message class="flash" />
    <router-view />
  </div>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import Loading from '@/components/base/Loading.vue'
import 'vue-flash-message/dist/vue-flash-message.min.css'
export default {
  components: {
    Loading
  },
  mounted () {
    if (isMobile) {
      document.body.classList.add('isMobile')
    }
    document.body.classList.remove('loading')
  }
}
</script>

<style lang="scss">
@import "~buefy/dist/buefy.css";
@import '~vue-select/src/scss/vue-select';

@import "~@/assets/styles/default";
@import "~@/assets/styles/media";
@import "~@/assets/styles/keyframes";

#app {
  min-height: 100%;
  margin: 0 auto;
}

.swal2-container.swal2-center {
  background: rgba(0, 0, 0, .65);
}

.flash {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 10000000000;
  > .flash__wrapper {
    > .flash__message {
      -webkit-animation: fadeOut 1s;
      animation: fadeOut 1s;
      animation-fill-mode: forwards;
      animation-delay: 2s;
      transition: .2s all cubic-bezier(0.55, 0.055, 0.675, 0.19);
      > .flash__message-content {
        font: {
          weight: bold;
        }
      }
    }
  }
}
</style>
