<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="부동산"
      description="학교 인근 다양한 방을 소개합니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <div class="container">
      Something
    </div>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'

export default {
  components: {
    Navigation, Landing, Footer
  },
  data () {
    return {
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
  }
}
</script>
