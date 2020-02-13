<template>
  <div class="wrapper">
    <Navigation is-static />
    <article class="post">
      <header>
        {{ post.title }}
      </header>
      <small>
        <span class="writer">{{ post.user.nick_nm }}</span>&nbsp;
        <span class="date">{{ new Date(post.reg_dt).toLocaleDateString() }}</span>
      </small>
      <hr>
      <div class="content">
        <div
          class="container"
          v-html="post.body"
        />
        <div class="files">
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
        </div>
        <div class="controls">
          <b-button
            tag="router-link"
            to="/board"
          >
            목록으로
          </b-button>
          <b-button
            v-show="articleWriter()"
            tag="router-link"
            :to="editArticle"
          >
            수정
          </b-button>
          <b-button
            v-show="articleWriter()"
            @click="removeArticle()"
          >
            삭제
          </b-button>
        </div>
        <hr>
        <Replies
          :post="parseInt($route.params.post_id)"
          :content="post.comments"
        />
      </div>
    </article>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'
import VueGallerySlideshow from 'vue-gallery-slideshow'
import Navigation from '@/components/base/Navigation.vue'
import Replies from '@/components/board/Replies.vue'
import Footer from '@/components/base/Footer.vue'
import { Post } from '@/assets/graphql/queries'
import { removePost } from '@/assets/graphql/mutations'
export default {
  name: 'App',
  components: {
    Navigation,
    Replies,
    Footer,
    VueGallerySlideshow
  },
  data () {
    return {
      scrollBase: null,
      meta: {},
      user_idx: null,
      post: null,
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
      if (data.post === null) {
        this.$router.push('/error/404')
      } else {
        this.post = data.post
      }
    }).catch(error => {
      console.error(error)
      // this.$router.push('/error/404')
    })
  },
  mounted () {
    this.scrollBase = 0
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
        showLoaderOnConfirm: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        cancelButtonColor: 'red',
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
        this.$router.push('/board')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
nav.gnb.static + .post {
  margin-top: 60px !important;
}

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
