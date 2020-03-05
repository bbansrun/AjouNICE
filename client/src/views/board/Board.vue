<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="boardTitle"
      :description="boardDescription"
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif"
    />
    <BoardNav :write-url="write_url" />
    <nav class="category">
      <ul class="category-menu">
        <li class="active">
          <router-link to="/board">
            전체
          </router-link>
        </li>
        <li
          v-for="category in navCategories"
          :key="category.category_idx"
        >
          <router-link :to="`/board/${category.title}`">
            {{ category.category_nm }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="container">
      <PostList :items="posts" />
      <!-- <infinite-loading
        spinner="waveDots"
        @infinite="infiniteHandler"
      >
        <div slot="no-more">
          <font-awesome-icon icon="times" />&nbsp;
          <span>더 이상 게시물이 없어요.</span>
        </div>
        <div slot="no-results">
          찾으시는 게시물이 없어요.
        </div>
      </infinite-loading> -->
    </div>
    <Footer />
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import urljoin from 'url-join'
import { Landing, Navigation, PostList, BoardNav, Footer } from '@/components'
import { Categories, AllCates, CateInfo, PostsByCate, SubCates, PaginationPosts } from '@/assets/graphql/queries'
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
      write_url: urljoin(this.$route.path, '/new'),
      posts: [],
      navCategories: [],
      cursor: ''
    }
  },
  apollo: {
    categories: {
      query: gql`${Categories}`,
      variables: {
        type: 'NORMAL',
        depth: 0
      }
    }
  },
  computed: {
    boardTitle () {
      if (!this.$route.params.category) {
        return '게시판'
      } else {
        if (!this.$route.params.name) {
          return this.category
        } else {
          return this.sub_category
        }
      }
    },
    boardDescription () {
      if (!this.$route.params.name) {
        return this.category_desc
      } else {
        return this.sub_category_desc
      }
    }
  },
  watch: {
    categories (value) {
      if (value) {
        this.initCategory()
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  updated () {
    this.initCategory()
  },
  methods: {
    initCategory () {
      if (this.$route.params.category) {
        // 특정 Depth 카테고리 내 전체 게시물 조회
        const cateIdx = _.findIndex(this.categories, (category) => (category.title === this.$route.params.category))
        this.navCategories = this.categories[cateIdx].childCategories
        if (this.$route.params.name) {
          // 특정 Depth 하위 카테고리 내 전체 게시물 조회
        }
      } else {
        this.navCategories = this.categories
      }
    }
    // infiniteHandler ($state) {
    //   // Get Pagination Data
    //   this.$apollo.query({
    //     query: gql`${PaginationPosts}`,
    //     variables: {
    //       cateType: 2,
    //       cursor: this.cursor
    //     }
    //   }).then(({ data: { paginatedPosts: { pageInfo, edges } } }) => {
    //     this.posts = this.posts.concat(edges)
    //     if (pageInfo.hasNext) {
    //       this.cursor = pageInfo.after
    //       $state.loaded() // 중간 지점 데이터 로드 완료시
    //     } else {
    //       $state.complete() // 최종 데이터 로드 완료시
    //     }
    //   })
    // },
  }
}
</script>
