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
    <div
      v-show="articleWriter()"
      class="controls"
    >
      <b-button
        tag="router-link"
        :to="editArticle"
      >
        수정
      </b-button>
      <button @click="removeArticle()">
        삭제
      </button>
    </div>
    <Replies
      :post="$route.params.post_id"
      :content="replies"
    />
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Replies from '@/components/board/Replies.vue'
import Footer from '@/components/base/Footer.vue'
import { Post } from '@/assets/graphql/queries'
export default {
  name: 'App',
  components: {
    Navigation,
    Landing,
    Replies,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      title: '',
      meta: {},
      body: '',
      user_idx: null,
      replies: []
    }
  },
  computed: {
    editArticle () {
      let url = this.$route.path
      url = url.split('/')
      url.pop()
      return urljoin(url.join('/'), 'edit')
    }
  },
  beforeCreate () {
    this.$apollo.query({
      query: gql`${Post}`,
      variables: {
        id: this.$route.params.post_id
      }
    }).then(({ data }) => {
      this.user_idx = data.post.user_idx
      this.title = data.post.title
      this.body = data.post.body
      this.replies = data.post.comments
    }).catch(error => {
      console.error(error)
      // window.location = '/error/404'
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    articleWriter () {
      console.log(this.$store.state.user.idx, this.user_idx)
      return this.$store.state.user.idx === this.user_idx
    },
    removeArticle () {
      console.log(this.$route.params.post_id)
      this.$swal({
        title: '삭제하시겠습니까?',
        width: '90vw',
        text: '삭제 후 복구가 불가능합니다.',
        type: 'warning',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      })
    }
  }
}
</script>
