<template>
  <div class="home">
    <Nav />
    <div class="container">
      <AjouNICE />
    </div>
    <header v-if="userInfo">안녕하세요 {{ userInfo.user_nm }}님 ^~^</header>
    <input type="button" @click="logout" value="임시 로그아웃 버튼" />
    <Footer />
  </div>
</template>

<script>
import Nav from '@/components/Navigation.vue'
import AjouNICE from '@/components/AjouNICE.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  data () {
    return {
      userInfo: null
    }
  },
  components: {
    Nav, AjouNICE, Footer
  },
  beforeCreate () {
    document.body.classList.remove('auth')
    this.$Axios.get('/api/protected').then(result => {
      this.userInfo = result.data.logged_in_as
    })
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
