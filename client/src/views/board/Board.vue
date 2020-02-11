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
    <section v-if="$route.params.category">
      <ul
        v-show="sub_categories"
        class="board-nav"
      >
        <li class="active">
          <a href="#">전체</a>
        </li>
        <li
          v-for="category in sub_categories"
          :key="category.category_idx"
        >
          <router-link :to="`/board/${$route.params.category}/${category.title}`">
            {{ category.category_nm }}
          </router-link>
        </li>
      </ul>
      <table class="list">
        <thead />
        <tbody />
        <tfoot />
      </table>
    </section>
    <section v-else>
      <ul
        v-show="categories"
        class="board-nav"
      >
        <li class="active">
          <a href="#">전체</a>
        </li>
        <li
          v-for="category in categories"
          :key="category.category_idx"
        >
          <router-link :to="`/board/${category.title}`">
            {{ category.category_nm }}
          </router-link>
        </li>
      </ul>
    </section>
    <div class="container">
      <PostList :items="posts" />
    </div>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'
import Landing from '@/components/base/Landing.vue'
import Navigation from '@/components/base/Navigation.vue'
import PostList from '@/components/board/PostList.vue'
import BoardNav from '@/components/board/BoardNav.vue'
import Footer from '@/components/base/Footer.vue'
import { CateInfo, PostsByCate, SubCates, BoardsAndPosts } from '@/assets/graphql/queries'
export default {
  name: 'Board',
  components: {
    Landing, Navigation, PostList, BoardNav, Footer
  },
  data () {
    return {
      scrollBase: null,
      categories: [],
      sub_categories: [],
      category: '',
      category_desc: '',
      category_idx: null,
      sub_category: '',
      sub_category_desc: '',
      sub_category_idx: null,
      write_url: urljoin(this.$route.path, '/new'),
      posts: []
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
  beforeCreate () {
    document.body.classList.toggle('loading')
  },
  beforeMount () {
    this.init()
  },
  created () {
    document.body.classList.toggle('loading')
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  updated () {
    this.init()
  },
  methods: {
    init () {
      if (this.$route.params.category) {
      // 특정 Depth 카테고리 내 전체 게시물 조회
        this.getCateInfo(this.$route.params.category)
        if (this.$route.params.name) {
        // 특정 Depth 하위 카테고리 내 전체 게시물 조회
          this.getSubCateInfo(this.category_idx, this.$route.params.name)
        }
      } else {
      // 전체 게시판, 게시물 조회
        this.getAll()
      }
    },
    getAll () {
      this.$apollo.query({
        query: gql`${BoardsAndPosts}`
      }).then(({ data }) => {
        this.categories = data.boards
        this.posts = data.posts
      })
    },
    getCateInfo (name) {
      this.$apollo.query({
        query: gql`${CateInfo}`,
        variables: {
          title: name
        }
      }).then(({ data }) => {
        try {
          const { categoryNm, categoryIdx } = data.boards[0]
          this.category = categoryNm
          this.category_idx = categoryIdx
          this.getSubCateInfo(data.boards[0].depth + 1, data.boards[0].category_idx, name)
        } catch (e) {
          throw Error(e)
        }
      }).catch((error) => {
        console.log(error)
        this.$router.push('/error/500')
      })
    },
    getSubCateInfo (depth, parent, name) {
      this.$apollo.query({
        query: gql`${SubCates}`,
        variables: {
          depth: depth,
          parent: parseInt(parent)
        }
      }).then(({ data }) => {
        this.sub_categories = data.boards
        this.getPosts(depth, parent)
      })
    },
    getPosts (depth, parent) {
      this.$apollo.query({
        query: gql`${PostsByCate}`,
        variables: {
          category_idx: parent
        }
      }).then(({ data }) => {
        this.posts = data.posts
      })
    }
  }
}
</script>
