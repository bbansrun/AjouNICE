<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="오늘의 학식"
      description="오늘의 학교 식단을 소개합니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>오늘의식단</strong>
        </header>
      </div>
    </main>
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
