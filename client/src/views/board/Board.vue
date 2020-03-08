<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      :description="desc"
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif"
    />
    <BoardNav :write-url="write_url" />
    <nav class="category">
      <ul class="category-menu">
        <li class="active">
          <router-link :to="`/board`">
            전체
          </router-link>
        </li>
        <li
          v-for="category in navCategories"
          :key="category.category_idx"
        >
          <router-link :to="$route.params.category ? `/board/${$route.params.category}/${category.title}` : `/board/${category.title}`">
            {{ category.category_nm }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="container">
      <PostList :items="posts" />
      <infinite-loading
        ref="infinitePostLoader"
        spinner="waveDots"
        @infinite="loadPosts"
      >
        <div slot="no-more">
          <font-awesome-icon icon="times" />&nbsp;
          <span>더 이상 게시물이 없어요.</span>
        </div>
        <div slot="no-results">
          <font-awesome-icon icon="times" />&nbsp;
          <span>찾으시는 게시물이 없어요.</span>
        </div>
      </infinite-loading>
    </div>
    <Footer />
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import urljoin from 'url-join'
import { Landing, Navigation, PostList, BoardNav, Footer } from '@/components'
import { Categories, PaginationPosts } from '@/assets/graphql/queries'
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
      cursor: '',
      cateIdx: null,
      title: '게시판',
      desc: '아주나이스 커뮤니티'
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
    categoryLink (moduleName) {
      let url
      if (this.$route.params.category) {
        if (!this.$route.params.name) {
          url = `/board/${this.$route.params.category}/${moduleName}`
        }
      }
      return url
    }
  },
  watch: {
    categories (value) {
      if (value) {
        this.initCategory()
      }
    },
    '$route' (value) {
      this.$router.go(0)
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    initCategory () {
      if (this.$route.params.category) {
        const idx = _.findIndex(this.categories, (category) => (category.title === this.$route.params.category))
        if (this.$route.params.name) {
          // Depth 1 카테고리 조회
          const depth1Idx = _.findIndex(this.categories[idx].childCategories, (category) => (category.title === this.$route.params.name))
          const depth1Category = this.categories[idx].childCategories[depth1Idx]
          this.title = depth1Category.category_nm
          this.desc = depth1Category.desc
          this.cateIdx = depth1Category.category_idx
          this.navCategories = []
        } else {
          // Depth 0 카테고리 조회
          const depth0Category = this.categories[idx]
          this.title = depth0Category.category_nm
          this.desc = depth0Category.desc
          this.cateIdx = depth0Category.category_idx
          this.navCategories = depth0Category.childCategories
        }
      } else {
        this.navCategories = this.categories
      }
    },
    loadPosts ($state) {
      this.$apollo.query({
        query: gql`${PaginationPosts}`,
        variables: {
          cursor: this.cursor,
          cateType: this.cateIdx || 0
        },
        fetchPolicy: 'network-only'
      }).then(({ data: { paginatedPosts: { pageInfo, edges } } }) => {
        this.posts = this.posts.concat(edges)
        if (pageInfo.hasNext) {
          this.cursor = pageInfo.after
          $state.loaded() // 중간 지점 데이터 로드 완료시
        } else {
          $state.complete() // 최종 데이터 로드 완료시
        }
      })
    }
  }
}
</script>
