<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper">
        <section
          v-if="post"
          class="post"
        >
          <header>
            <div class="header grid">
              <h3>{{ post.title }}</h3>
              <small class="category has-text-right">
                <router-link
                  class="underline underline-animated"
                  :to="`/board/${post.category.title}`"
                >{{ post.category.category_nm }} 게시판</router-link>
              </small>
            </div>
            <div class="meta has-text-right">
              <small>
                <span class="writer">{{ post.user.nick_nm }}</span>&nbsp;
                <span class="date">{{ post.reg_dt | formatDateTime }}</span>&nbsp;
              </small>
            </div>
          </header>
          <hr>
          <div class="content">
            <div
              class="container"
              v-html="post.body"
            />
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
                  to="/board"
                >
                  <font-awesome-icon icon="th-list" />&nbsp;
                  <span>목록으로</span>
                </b-button>
                <b-button
                  v-show="articleWriter()"
                  tag="router-link"
                  size="is-small"
                  type="is-dark"
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
                <b-tooltip
                  type="is-info"
                  label="허위내용을 포함하거나, 유해한 내용의 게시물 신고가 가능합니다."
                  position="is-left"
                  animated
                >
                  <b-button
                    size="is-small"
                    :type="{ 'is-warning': !onReport, 'is-danger': onReport }"
                    @click="toggleReport"
                  >
                    <font-awesome-icon icon="exclamation-triangle" />&nbsp;
                    <span>{{ !onReport ? '신고' : '취소' }}</span>
                  </b-button>
                </b-tooltip>
              </div>
              <Report
                v-show="onReport"
                :board_idx="parseInt($route.params.post_id)"
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
import urljoin from 'url-join'
import VueClipBoard from 'vue-clipboard2'
import gql from 'graphql-tag'
import { Post } from '@/assets/graphql/queries'
import { modPost, IncrementViewCount } from '@/assets/graphql/mutations'
import { Navigation, Report, Replies, Footer } from '@/components'
import { replyWritten, replyRemoved, replyModified } from '@/assets/graphql/subscriptions'
VueClipBoard.config.autoSetContainer = true
Vue.use(VueClipBoard)
export default {
  components: {
    Navigation,
    Report,
    Replies,
    Footer
  },
  data () {
    return {
      post_id: this.$route.params.post_id,
      meta: {},
      user_idx: null,
      onReport: false
    }
  },
  apollo: {
    post: {
      query: gql`${Post}`,
      variables () {
        return {
          id: this.post_id
        }
      },
      fetchPolicy: 'network-only',
      error (error) {
        console.error(error)
        this.$router.push('/error/404')
      }
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
    this.$apollo.mutate({
      mutation: gql`${IncrementViewCount}`,
      variables: {
        id: parseInt(this.post_id)
      }
    }).then(({ data: { incrementView: { view_cnt } } }) => {
      this.post.view_cnt = view_cnt
    })
  },
  mounted () {
    document.body.classList.remove('loading')
    const self = this
    const writtenObserver = this.$apollo.subscribe({
      query: gql`${replyWritten}`
    })
    const removedObserver = this.$apollo.subscribe({
      query: gql`${replyRemoved}`
    })
    const modifiedObserver = this.$apollo.subscribe({
      query: gql`${replyModified}`
    })

    writtenObserver.subscribe({
      next ({ data: { replyWritten } }) {
        self.post.comments.unshift(replyWritten)
        document.body.classList.remove('loading')
      },
      error (error) {
        this.flashError('댓글 작성 중 알 수 없는 오류가 발생했습니다.')
        console.error(error)
      }
    })

    removedObserver.subscribe({
      next ({ data: { replyRemoved } }) {
        self.post.comments = _.remove(self.post.comments, (item) => {
          return item.cmt_idx !== replyRemoved.cmt_idx
        })
        document.body.classList.remove('loading')
      },
      error (error) {
        this.flashError('댓글 삭제 중 알 수 없는 오류가 발생했습니다.')
        console.error(error)
      }
    })

    modifiedObserver.subscribe({
      next ({ data: { replyModified } }) {
        self.post.comments[_.findIndex(self.post.comments, (item) => (item.cmt_idx === replyModified.cmt_idx))] = replyModified
        document.body.classList.remove('loading')
      },
      error (error) {
        this.flashError('댓글 수정 중 알 수 없는 오류가 발생했습니다.')
        console.error(error)
      }
    })
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
    },
    articleWriter () {
      return parseInt(this.$store.state.user.idx) === parseInt(this.post.user.user_idx)
    },
    removeArticle () {
      this.$buefy.dialog.confirm({
        title: '삭제하시겠습니까?',
        message: '삭제한 게시물은 복구가 불가능합니다.',
        confirmText: '삭제',
        cancelText: '취소',
        type: 'is-danger',
        hasIcon: true,
        icon: 'exclamation-triangle',
        onConfirm: () => {
          document.body.classList.add('loading')
          this.$apollo.mutate({
            mutation: gql`${modPost}`,
            variables: {
              mode: 'DESTROY',
              options: {
                board_idx: parseInt(this.$route.params.post_id)
              }
            }
          }).then(({ data: { modPost: { result } } }) => {
            if (result) {
              this.flashSuccess('삭제되었습니다.')
              document.body.classList.remove('loading')
              this.$router.push('/board')
            }
          }).catch(error => {
            console.error(error)
          })
        }
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
</style>

<style>
.control-label {
  white-space: nowrap !important;
}
</style>
