<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="board.category_nm"
      description=""
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>{{ board.category_nm }}</strong>
        </header>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Navigation, Landing, Footer } from '@/components'
import { CateInfo } from '@/assets/graphql/queries'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      board: {
        category_nm: '',
        category_idx: ''
      }
    }
  },
  beforeCreate () {
    this.$apollo.query({
      query: gql`${CateInfo}`,
      variables: {
        title: this.$route.params.category
      }
    }).then(({ data: { boards } }) => {
      this.board = boards[0]
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
