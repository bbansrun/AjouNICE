<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="keyword"
      :description="`${keyword}에 대한 검색결과입니다.`"
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
import { Landing, Navigation, PostList, BoardNav, Footer } from '@/components'
import { PostsByKeyword } from '@/assets/graphql/queries'
export default {
  components: {
    Landing,
    Navigation,
    PostList,
    BoardNav,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      keyword: this.$route.query.keyword
    }
  },
  apollo: {
    posts: {
      query: gql`${PostsByKeyword}`,
      variables () {
        return {
          keyword: this.keyword
        }
      },
      update: data => data.postsByKeyword
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
