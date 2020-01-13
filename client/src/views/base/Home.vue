<template>
  <div class="home">
    <!-- <Nav /> -->
    <div class="container">
      <!-- 주요 메뉴 영역 -->
      <IconNav :data="iconNav" />
      <!-- 게시글 리스트 영역 -->
      <!-- 맛집 리스트 영역 -->
      <!-- <AjouNICE /> -->
    </div>
    <header v-if="userInfo">안녕하세요 {{ userInfo.user_nm }}님 ^~^</header>
    <input type="button" @click="logout" value="임시 로그아웃 버튼" />
    <Footer />
  </div>
</template>

<script>
import Nav from '@/components/Navigation.vue'
import IconNav from '@/components/IconNav.vue'
import AjouNICE from '@/components/AjouNICE.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  data () {
    return {
      userInfo: null,
      iconNav: [
        { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
        { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/' },
        { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/' },
        { id: 4, title: 'Ajou맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/' },
      ]
    }
  },
  components: {
    Nav, IconNav, AjouNICE, Footer
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
