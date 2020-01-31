<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      description=""
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div
      class="container"
      v-html="body"
    />
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'App',
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      title: '',
      meta: {},
      body: ''
    }
  },
  beforeCreate () {
    const board_idx = this.$route.params.post_id
    this.$apollo.query({
      query: gql`{ findBoardByBoardIdx(board_idx: ${board_idx}) { title body } }`
    }).then(({ data }) => {
      if (data.findBoardByBoardIdx === null) {
        throw Error('존재하지 않는 게시물입니다.')
      }
      this.title = data.findBoardByBoardIdx.title
      this.body = data.findBoardByBoardIdx.body
    }).catch(error => {
      console.error(error)
      window.location = '/error/404'
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
