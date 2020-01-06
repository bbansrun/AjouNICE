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
    document.body.classList.add('loading')
  },
  mounted () {
    document.body.classlist.remove('loading')
  }
}
</script>

<style lang="scss">
#app {
  min-height: 100%;
  margin: 0 auto;
}
</style>
