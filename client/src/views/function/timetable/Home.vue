<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="시간표"
      description="시간표"
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>시간표</strong>
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
      scrollBase: null
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
