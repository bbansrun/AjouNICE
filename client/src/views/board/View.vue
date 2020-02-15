<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <article class="post">
        <div class="content-wrapper">
          <header>
            <div class="header grid">
              <h3>{{ post.title }}</h3>
              <small class="category">
                <router-link
                  class="underline underline-animated"
                  :to="`/board/${post.category.title}`"
                >{{ post.category.category_nm }} 게시판</router-link>
              </small>
            </div>
            <div class="meta has-text-right">
              <small>
                <span class="writer">{{ post.user.nick_nm }}</span>&nbsp;
                <span class="date">{{ new Date(post.reg_dt) | moment("YYYY-MM-DD HH:MM") }}</span>&nbsp;
              </small>
            </div>
          </header>
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
            <div class="controls has-text-right">
              <div class="meta-bottom">
                <small>
                  <span class="permalink">
                    <a :href="permalink">{{ permalink }}</a>&nbsp;
                    <b-tooltip
                      label="클릭하시면 주소가 복사됩니다."
                      always
                    >
                      <b-button
                        v-clipboard:copy="permalink"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        type="is-small"
                      >
                        <span>복사</span>
                      </b-button>
                    </b-tooltip>
                  </span>
                </small>
              </div>
              <b-button
                tag="router-link"
                size="is-small"
                type="is-primary"
                to="/board"
              >
                <font-awesome-icon icon="th-list" />&nbsp;
                <span>목록으로</span>
              </b-button>
              <b-button
                v-show="articleWriter()"
                tag="router-link"
                size="is-small"
                type="is-warning"
                :to="editArticle"
              >
                <font-awesome-icon icon="pen" />&nbsp;
                <span>수정</span>
              </b-button>
              <b-button
                v-show="articleWriter()"
                size="is-small"
                type="is-danger"
                @click="removeArticle()"
              >
                <font-awesome-icon icon="trash" />&nbsp;
                <span>삭제</span>
              </b-button>
            </div>
            <hr>
            <Replies
              :post="parseInt($route.params.post_id)"
              :content="post.comments"
            />
          </div>
        </div>
      </article>
      <Footer />
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import urljoin from 'url-join'
import moment from 'vue-moment'

import { Tooltip } from 'buefy'
import VueClipBoard from 'vue-clipboard2'
import VueGallerySlideshow from 'vue-gallery-slideshow'

import gql from 'graphql-tag'
import { Post } from '@/assets/graphql/queries'
import { removePost } from '@/assets/graphql/mutations'

import Navigation from '@/components/base/Navigation.vue'
import Replies from '@/components/board/Replies.vue'
import Footer from '@/components/base/Footer.vue'

VueClipBoard.config.autoSetContainer = true
Vue.use(moment)
Vue.use(Tooltip)
Vue.use(VueClipBoard)
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
      meta: {},
      user_idx: null,
      post: {
        title: '',
        body: '',
        user: {
          user_idx: null,
          nick_nm: ''
        },
        category: {
          title: ''
        },
        comments: []
      },
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
    },
    permalink () {
      return window.location.href
    }
  },
  beforeMount () {
    document.body.classList.add('loading')
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
    document.body.classList.remove('loading')
  },
  beforeUpdate () {
    document.body.classList.add('loading')
  },
  updated () {
    document.body.classList.remove('loading')
  },
  methods: {
    onCopy (e) {
      this.$swal('복사!', '복사되었습니다.', 'success')
    },
    onError (e) {
      this.$swal('에러!', '복사 중 에러가 발생하였습니다.', 'error')
    },
    articleWriter () {
      return parseInt(this.$store.state.user.idx) === parseInt(this.post.user.user_idx)
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
body.isMobile {
  & .b-tooltip {
    display: none;
  }
}

hr {
  margin: .5rem 0;
}

nav.gnb.static {
  + main {
    & .post {
      margin-top: 60px !important;
      padding: 0 !important;
      & header {
        > .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        > .meta {
          line-height: 1;
        }
      }
      & .content {
        > .container {
          padding: 0;
        }
      }
    }
  }
}

.control-label {
  white-space: nowrap !important;
}

.content-wrapper {
  padding: 0 .8rem;
}

article header span::before {
  display: unset;
  background: unset;
  height: unset;
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

.files {
  margin-bottom: 1rem;
}

.controls {
  > a, button {
    margin-right: 5px;
    &:last-child {
      margin-right: 0 !important;
    }
  }
}
</style>
