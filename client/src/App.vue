<template>
  <div id="app">
    <Loading />
    <flash-message class="flash" />
    <router-view />
  </div>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { Loading } from '@/components'
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
</style>
