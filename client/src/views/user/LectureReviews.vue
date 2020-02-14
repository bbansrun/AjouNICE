<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="나의 강의평가"
      :description="`${$store.state.user.name}님께서 평가하신 강의평입니다.`"
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <main>
      <div class="wrapper container">
        <div class="controls">
          <div class="buttons">
            <b-button
              tag="router-link"
              size="is-small"
              type="is-primary"
              :to="`/profile/${$store.state.user.idx}`"
            >
              <span>&larr; 돌아가기</span>
            </b-button>
          </div>
        </div>
        <hr>
        <MyReviews />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'
import MyReviews from '@/components/function/reviews/MyReviews.vue'
export default {
  components: {
    Navigation,
    Landing,
    Footer,
    MyReviews
  },
  data () {
    return {
      scrollBase: null,
      user_nm: null
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>

<style lang="scss" scoped>
.controls {
  > .buttons {
    justify-content: flex-end;
  }
}
</style>
