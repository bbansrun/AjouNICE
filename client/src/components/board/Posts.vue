<template>
  <section class="posts">
    <!-- Default Posts Load (base: 5 posts) -->
    <div
      v-for="post in posts"
      :key="post.node.board_idx"
      class="default-posts"
    >
      <router-link :to="`/board/${post.node.board_idx}/view`">
        <article class="post">
          <header>
            <div class="wrapper">
              <h3>{{ post.node.title }}</h3>
              <div class="meta">
                <div class="info">
                  <span>
                    <small>{{ post.node.user.nick_nm }}</small>&nbsp;
                  </span>
                </div>
                <div class="info">
                  <span>
                    <small>{{ post.node.reg_dt | formatDateTime }}</small>&nbsp;&nbsp;
                  </span>
                  <span>
                    <small>
                      <font-awesome-icon icon="eye" />&nbsp;
                      {{ post.node.view_cnt | numberWithCommas }}&nbsp;
                    </small>
                  </span>
                </div>
              </div>
            </div>
          </header>
          <div class="replies">
            <span>{{ post.node.comments.length > 99 ? '100+' : (post.node.comments.length | numberWithCommas) }}</span>
            <h6>댓글</h6>
          </div>
        </article>
      </router-link>
    </div>
    <!-- Posts Loaded by Infinite Loader -->
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
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { PaginationPosts } from '@/assets/graphql/queries'
export default {
  props: {
    cateIdx: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      cursor: '',
      posts: []
    }
  },
  watch: {
    cateIdx (value) {
      this.posts = []
      this.cursor = ''
      this.$refs.infinitePostLoader.stateChanger.reset()
    }
  },
  methods: {
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

<style lang="scss" scoped>
section.posts {
  background: #fff;
  > .default-posts {
    border: {
        top: 1px solid rgba(0,0,0,.2);
        bottom: 1px solid rgba(0,0,0,.2);
    }
    & a {
        display: inline-block;
        color: #000;
    }
    & article {
        width: 100vw;
        display: grid;
        grid-template-columns: 6fr 1fr;
        padding: 0 !important;
        margin: 0 !important;
        > header {
            display: grid;
            grid-template-columns: auto 80px;
            width: 100%;
            padding: .6rem .8rem;
            overflow: hidden;
            > .wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                overflow: hidden;
                > h3 {
                    width: 100%;
                    font: {
                    family: 'KoPub Dotum';
                    }
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                > p {
                    margin-top: auto;
                }
            }
            > .thumbnail {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #eee;
                border-radius: 1rem;
                > img {
                    width: auto;
                    max-height: 80%;
                }
            }
        }
        > .replies {
            height: inherit;
            width: auto;
            position: relative;
            background: #e2e2e2;
            font-size: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            > h6 {
                line-height: 1;
            }
        }
        > .thumbnail {
            max-width: 100px;
            max-height: 100px;
        }
    }
  }
}

.no-posts {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style>
