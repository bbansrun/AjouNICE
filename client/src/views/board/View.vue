<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      description=""
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <div
        class="content"
        v-html="body"
      />
      <header>첨부 이미지</header>
      <div class="image-wrapper">
        <img
          v-for="(image, i) in images"
          :key="i"
          class="image"
          :src="image"
          @click="index = i"
        >
        <vue-gallery-slideshow
          :images="images"
          :index="index"
          @close="index = null"
        />
      </div>
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
    </div>
    <Replies
      :post="parseInt($route.params.post_id)"
      :content="replies"
    />
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'
import VueGallerySlideshow from 'vue-gallery-slideshow'
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Replies from '@/components/board/Replies.vue'
import Footer from '@/components/base/Footer.vue'
import { Post } from '@/assets/graphql/queries'
import { removePost } from '@/assets/graphql/mutations'
export default {
  name: 'App',
  components: {
    Navigation,
    Landing,
    Replies,
    Footer,
    VueGallerySlideshow
  },
  data () {
    return {
      scrollBase: null,
      title: '',
      meta: {},
      body: '',
      user_idx: null,
      replies: [],
      images: [
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/804/800',
        'https://placekitten.com/805/800',
        'https://placekitten.com/806/800',
        'https://placekitten.com/807/800',
        'https://placekitten.com/808/800',
        'https://placekitten.com/809/800',
        'https://placekitten.com/810/800'
      ],
      index: null
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
      return this.$store.state.user.idx === this.user_idx
    },
    removeArticle () {
      const that = this
      this.$swal({
        title: '삭제하시겠습니까?',
        width: '90vw',
        text: '삭제 후 복구가 불가능합니다.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        preConfirm () {
          that.$apollo.mutate({
            mutation: gql`${removePost}`,
            variables: {
              id: parseInt(that.$route.params.post_id)
            }
          }).then(({ data }) => {
            return data
          })
        }
      }).then((result) => {
        this.flash('삭제되었습니다.', 'success')
        // window.location = '/board/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1rem;
}

.image-wrapper {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  column-gap: .5rem;
  margin-bottom: .5rem;
  > img {
    cursor: pointer;
    transition: .2s all ease;
    box-shadow: 0 3px 3px rgba(0,0,0,.25);
    &:hover {
      transform: translateY(-3px);
    }
  }
}

.vgs__container {
  top: 5rem;
}
</style>
