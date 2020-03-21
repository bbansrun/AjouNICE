<template>
  <div class="wrapper">
    <Navigation is-static />
    <InfinitySwipe
      class="categories"
      :current-page="1"
      :item-width="224"
      @move="onMoveCategory"
      @touch-end="onTouchEnd"
      @change-page="onChangePage"
    >
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="infinity-swipe-item"
      >
        <h2
          :class="{'active': activeCategory === category.category_idx}"
          @click="onCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </h2>
        <h2
          :class="{'active': activeCategory === category.category_idx}"
          @click="onCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </h2>
      </div>
    </InfinitySwipe>
    <InfinitySwipe
      class="categories"
      :current-page="1"
      :item-width="224"
      @move="onMoveCategory"
      @touch-end="onTouchEnd"
      @change-page="onChangePage"
    >
      <div
        v-for="(category, index) in childCategories"
        :key="index"
        class="infinity-swipe-item"
      >
        <h2
          :class="{'active': activeCategory === category.category_idx}"
          @click="onCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </h2>
        <h2
          :class="{'active': activeCategory === category.category_idx}"
          @click="onCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </h2>
      </div>
    </InfinitySwipe>
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
import { Navigation, PostList, Footer } from '@/components'
import { Categories, PaginationPosts } from '@/assets/graphql/queries'
import InfinitySwipe from 'vue-swipe-menu'
import 'vue-swipe-menu/dist/vue-swipe-menu.css'
export default {
  components: {
    Navigation,
    PostList,
    Footer,
    InfinitySwipe
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
      desc: '아주나이스 커뮤니티',
      activeCategory: 2
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
  methods: {
    onCategoryClicked (index) {
      console.log(index)
    },
    onMoveCategory () {},
    onChangePage () {},
    onTouchEnd () {},
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

<style lang="scss">
.categories {
  width: 100vw;
  background: #6400FF;
  color: #fff;
  & .infinity-swipe-item {
    padding: .5rem 0;
    > h2 {
      display: inline-block;
      margin: 0 15px;
      &.active {
        text-shadow: 0 0 5px rgba(0,0,0,.5);
      }
    }
  }
}
</style>
