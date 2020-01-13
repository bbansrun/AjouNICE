<template>
    <div class="wrapper">
      <Landing title="AjouNICE!" description="아주나이스 서비스를 소개합니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif" isLogo />
      <div class="container">
      </div>
      <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'about',
  components: {
    Landing, Footer
  }
}
</script>

<style lang="scss">

</style>
