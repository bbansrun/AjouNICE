<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="사이트맵"
      description="아주나이스 전체 페이지 구성을 보여드립니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block">
          <strong>사이트맵</strong>
        </header>
        <div class="sitemap">
          <router-link to="/">
            홈
          </router-link>
        </div>
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
      scrollBase: null
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
