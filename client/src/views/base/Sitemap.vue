<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="사이트맵"
      description="아주나이스 전체 페이지 구성을 보여드립니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <div class="container">
      <article class="sitemap-wrapper">
        <header class="underline underline-inline-block">
          사이트맵
        </header>
        <div class="sitemap">
          <router-link to="/#/">
            홈
          </router-link>
        </div>
      </article>
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
