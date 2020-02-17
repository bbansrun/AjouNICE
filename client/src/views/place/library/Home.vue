<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="도서관"
      description="학교 도서관 정보를 알려드립니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>도서관</strong>
        </header>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import { Navigation, Landing, Footer } from '@/components'
export default {
  components: {
    Navigation,
    Landing,
    Footer
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
