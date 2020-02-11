<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="$route.query.keyword"
      :description="`${$route.query.keyword}에 대한 검색결과입니다.`"
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif"
    />
    <BoardNav write-url="/board/new" />
    <div class="container">
      <PostList :items="posts" />
    </div>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Landing from '@/components/base/Landing.vue'
import Navigation from '@/components/base/Navigation.vue'
import PostList from '@/components/board/PostList.vue'
import BoardNav from '@/components/board/BoardNav.vue'
import Footer from '@/components/base/Footer.vue'
import { PostsByKeyword } from '@/assets/graphql/queries'
export default {
  name: 'Board',
  components: {
    Landing, Navigation, PostList, BoardNav, Footer
  },
  data () {
    return {
      scrollBase: null,
      posts: []
    }
  },
  beforeCreate () {
    document.body.classList.toggle('loading')
  },
  beforeMount () {
    this.queryPosts()
  },
  updated () {
    this.queryPosts()
  },
  created () {
    document.body.classList.toggle('loading')
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    queryPosts () {
      this.$apollo.query({
        query: gql`${PostsByKeyword}`,
        variables: {
          keyword: this.$route.query.keyword
        }
      }).then(({ data }) => {
        this.posts = data.postsByKeyword
      })
    }
  }
}
</script>
