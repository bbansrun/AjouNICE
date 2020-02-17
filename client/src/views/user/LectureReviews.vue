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
              size="is-small"
              type="is-primary"
              @click="goBack"
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
import { Navigation, Landing, Footer, MyReviews } from '@/components'
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
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
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
