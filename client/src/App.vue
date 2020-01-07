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
#app {
  min-height: 100%;
  margin: 0 auto;
}
</style>
