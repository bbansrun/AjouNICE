<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper">
        <section class="post">
          <header>
            <div class="header grid">
              <h3>{{ post.res_nm }}</h3>
              <small class="category has-text-right">
                <router-link
                  class="underline underline-animated"
                  :to="`/place/gourmet/${post.category.title}`"
                >{{ post.category.category_nm }} 게시판</router-link>
              </small>
            </div>
            <div class="meta has-text-right">
              <small>
                <span class="date">{{ post.reg_dt | formatDateTime }}</span>
              </small>
            </div>
          </header>
          <hr>
          <div class="content">
            <div class="container">
              <article>
                <header>
                  <strong>{{ post.res_info }}</strong>
                </header>
                <figure>
                  <img
                    :src="post.res_icon"
                    :alt="`[맛집] ${post.category.category_nm} - ${post.res_nm}`"
                  >
                  <figcaption>{{ `[맛집] ${post.category.category_nm} - ${post.res_nm}` }}</figcaption>
                </figure>
                <div class="content">
                  <div class="info">
                    <h5>메뉴</h5>
                    <b-taglist>
                      <b-tag
                        v-for="item in post.res_menu.split(',')"
                        :key="item"
                        type="is-info"
                      >
                        {{ item }}
                      </b-tag>
                    </b-taglist>
                  </div>
                  <div class="info">
                    <h5>주소</h5>
                    <p>{{ post.res_addr }}</p>
                  </div>
                  <div class="info">
                    <h5>연락처</h5>
                    <p>{{ post.res_phone }}</p>
                  </div>
                </div>
                <div class="info">
                  <h5>사용자 평점</h5>
                  <b-rate
                    v-model="post.star_avg"
                    :max="5"
                    :show-score="true"
                    :rtl="false"
                    :spaced="false"
                    :disabled="true"
                  />
                </div>
              </article>
            </div>
            <hr>
            <div class="images">
              <img
                v-for="(image, i) in slideImages"
                :key="i"
                class="image"
                :src="image"
                @click="index = i"
              >
              <vue-gallery-slideshow
                :images="slideImages"
                :index="index"
                @close="index = null"
              />
            </div>
            <hr>
            <div class="controls">
              <div class="meta-bottom has-text-right">
                <small>
                  <span class="views">
                    <font-awesome-icon icon="eye" />&nbsp;
                    <span>{{ post.view_cnt }}</span>
                  </span>
                </small>&nbsp;
                <small>
                  <span class="comments">
                    <font-awesome-icon icon="comments" />&nbsp;
                    <span>{{ post.comments.length }}</span>
                  </span>
                </small>
              </div>
              <div class="meta-bottom has-text-right">
                <small>
                  <span class="permalink">
                    <a :href="permalink">{{ permalink }}</a>&nbsp;
                    <b-tooltip
                      type="is-info"
                      label="클릭하시면 주소가 복사됩니다."
                      position="is-left"
                      animated
                    >
                      <b-button
                        v-clipboard:copy="permalink"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                        type="is-small"
                      >
                        <font-awesome-icon icon="copy" />&nbsp;
                        <span>복사</span>
                      </b-button>
                    </b-tooltip>
                  </span>
                </small>
              </div>
              <div class="meta-bottom buttons">
                <b-button
                  tag="router-link"
                  size="is-small"
                  type="is-primary"
                  :to="`/place/gourmet/${post.category.title}`"
                >
                  <font-awesome-icon icon="th-list" />&nbsp;
                  <span>목록으로</span>
                </b-button>
                <b-tooltip
                  type="is-info"
                  label="갱신이 필요하거나 잘못된 내용이 있다면 신고해주세요."
                  position="is-left"
                  animated
                >
                  <b-button
                    size="is-small"
                    :type="{ 'is-danger': !onReport, 'is-warning': onReport }"
                    @click="toggleReport"
                  >
                    <font-awesome-icon icon="exclamation-triangle" />&nbsp;
                    <span>{{ !onReport ? '신고' : '취소' }}</span>
                  </b-button>
                </b-tooltip>
              </div>
              <Report
                v-show="onReport"
                :res_idx="parseInt($route.params.post_id)"
              />
            </div>
            <hr>
            <Replies
              :post="parseInt($route.params.post_id)"
              :content.sync="post.comments"
            />
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import VueClipBoard from 'vue-clipboard2'
import VueGallerySlideshow from 'vue-gallery-slideshow'
import gql from 'graphql-tag'
import { GourmetById } from '@/assets/graphql/queries'
import { IncrementViewCount } from '@/assets/graphql/mutations'
import { Navigation, Report, GourmetReplies as Replies, Footer } from '@/components'
// import { replyWritten, replyRemoved, replyModified } from '@/assets/graphql/subscriptions'
VueClipBoard.config.autoSetContainer = true
Vue.use(VueClipBoard)
export default {
  components: {
    Navigation,
    Report,
    Replies,
    Footer,
    VueGallerySlideshow
  },
  data () {
    return {
      index: null,
      slideImages: [],
      meta: {},
      user_idx: null,
      onReport: false,
      post: {
        res_idx: '',
        category: {
          title: '',
          category_type: '',
          category_nm: '',
          category_idx: ''
        },
        res_nm: '',
        res_icon: '',
        star_avg: 0,
        view_cnt: 0,
        res_menu: '',
        res_info: '',
        res_lat: null,
        res_lon: null,
        res_addr: '',
        res_phone: '',
        reg_dt: '',
        upt_dt: '',
        comments: [],
        resources: []
      }
    }
  },
  computed: {
    permalink () {
      return window.location.href
    }
  },
  beforeMount () {
    document.body.classList.add('loading')
    this.$apollo.query({
      query: gql`${GourmetById}`,
      variables: {
        id: parseInt(this.$route.params.post_id)
      }
    }).then(({ data: { gourmetById } }) => {
      if (gourmetById === null) {
        this.$router.push('/error/404')
      } else {
        this.post = gourmetById
        this.post.resources.forEach(item => {
          this.slideImages.push(item.img_path)
        })
        this.$apollo.mutate({
          mutation: gql`${IncrementViewCount}`,
          variables: {
            id: parseInt(this.$route.params.post_id)
          }
        }).then(({ data: { incrementView: { view_cnt } } }) => {
          this.post.view_cnt = view_cnt
        })
      }
    }).catch(error => {
      console.error(error)
      this.$router.push('/error/500')
    })
  },
  mounted () {
    document.body.classList.remove('loading')
    // const self = this
    // const writtenObserver = this.$apollo.subscribe({
    //   query: gql`${replyWritten}`
    // })
    // const removedObserver = this.$apollo.subscribe({
    //   query: gql`${replyRemoved}`
    // })
    // const modifiedObserver = this.$apollo.subscribe({
    //   query: gql`${replyModified}`
    // })

    // writtenObserver.subscribe({
    //   next ({ data: { replyWritten } }) {
    //     self.post.comments.unshift(replyWritten)
    //     document.body.classList.remove('loading')
    //   },
    //   error (error) {
    //     self.flashError('댓글 작성 중 알 수 없는 오류가 발생했습니다.')
    //     console.error(error)
    //   }
    // })

    // removedObserver.subscribe({
    //   next ({ data: { replyRemoved } }) {
    //     self.post.comments = _.remove(self.post.comments, (item) => {
    //       return item.cmt_idx !== replyRemoved.cmt_idx
    //     })
    //     document.body.classList.remove('loading')
    //   },
    //   error (error) {
    //     self.flashError('댓글 삭제 중 알 수 없는 오류가 발생했습니다.')
    //     console.error(error)
    //   }
    // })

    // modifiedObserver.subscribe({
    //   next ({ data: { replyModified } }) {
    //     self.post.comments[_.findIndex(self.post.comments, (item) => (item.cmt_idx === replyModified.cmt_idx))] = replyModified
    //     document.body.classList.remove('loading')
    //   },
    //   error (error) {
    //     self.flashError('댓글 수정 중 알 수 없는 오류가 발생했습니다.')
    //     console.error(error)
    //   }
    // })
  },
  beforeUpdate () {
    document.body.classList.add('loading')
  },
  updated () {
    document.body.classList.remove('loading')
  },
  methods: {
    toggleReport () {
      if (this.onReport) {
        this.onReport = false
      } else {
        this.onReport = true
      }
    },
    onCopy (e) {
      this.$swal('복사!', '복사되었습니다.', 'success')
    },
    onError (e) {
      this.$swal('에러!', '복사 중 에러가 발생하였습니다.', 'error')
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
      & header {
        > .header {
          font-family: 'KoPub Dotum';
          display: grid;
          grid-template-columns: auto 80px;
          align-items: center;
          > h3 {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > .category {
            justify-content: flex-end;
          }
        }
        > .meta {
          line-height: 1;
        }
      }
      & .content {
        > .container {
          font-family: 'KoPub Dotum';
          padding: 0;
        }
      }
    }
  }
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
  .meta-bottom {
    justify-content: flex-end;
    &:first-of-type {
      margin-bottom: .5rem;
    }
  }
  > a, button {
    margin-right: 5px;
    &:last-child {
      margin-right: 0 !important;
    }
  }
}

.meta-bottom {
  margin: {
    bottom: .5rem;
  }
}

.images {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  > .image {
    max-width: 100px;
    max-height: 100px;
  }
}
</style>

<style>
.control-label {
  white-space: nowrap !important;
}
</style>
