<template>
  <div class="home">
    <nav class="gnb">
      <div class="logo">
        <h1>AjouNICE!</h1> | <small>아주대학교 차세대 커뮤니티 서비스</small>
      </div>
      <div>
        <header>안녕하세요 빤스런님 ^~^</header>
        <input type="button" @click="logout" value="임시 로그아웃 버튼" />
      </div>
    </nav>
    <div class="container">
      <AjouNICE />
    </div>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import AjouNICE from '@/components/AjouNICE.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  components: {
    AjouNICE, Footer
  },
  beforeCreate () {
    document.body.classList.remove('auth')
  },
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT')
        .then(() => {
          document.body.classList.toggle('loading')
          window.location = '/'
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
body {
  background: #eaeaea;
}
</style>
