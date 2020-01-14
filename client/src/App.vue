<template>
  <div id="app">
    <Loading />
    <router-view />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
export default {
  components: {
    Loading
  },
  beforeMount () {
    document.body.classList.toggle('loading')
  },
  mounted () {
    document.body.classList.toggle('loading')
  },
  created () {
    // this.$Axios.interceptors.response.use(undefined, (err) => {
    //   return new Promise((resolve, reject) => {
    //     if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
    //       this.$store.dispatch('LOGOUT')
    //     }
    //     throw err
    //   })
    // })
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset.scss";
@import "~@/assets/styles/fonts.scss";
@import "~@/assets/styles/index.scss";
@import "~@/assets/styles/media.scss";
@import "~@/assets/styles/auth.scss";
@import "~@/assets/styles/keyframes.scss";
@import "~@/assets/styles/components/Button.scss";
@import "~@/assets/styles/components/Link.scss";
#app {
  min-height: 100%;
  margin: 0 auto;
}
</style>
