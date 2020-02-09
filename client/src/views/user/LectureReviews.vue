<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="나의 강의평가"
      :description="`${$store.state.user.name}님께서 평가하신 강의평입니다.`"
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <div class="control">
        <b-button
          tag="router-link"
          :to="`/profile/${$store.state.user.idx}`"
        >
          &larr; 돌아가기
        </b-button>
      </div>
      <section class="user">
        <article>
          <header class="underline underline-inline-block">
            나의 강의평가
          </header>
        </article>
      </section>
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
      scrollBase: null,
      user_nm: null
    }
  },
  computed: {
  },
  beforeMount () {
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
  }
}
</script>
