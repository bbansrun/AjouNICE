<template>
  <section class="popular">
    <header v-if="showHeader">
      <small>핫이슈</small>
      <h2>주목해야할 게시물</h2>
    </header>
    <div
      v-if="items && items.length > 0"
      class="posts"
    >
      <div
        v-for="post in items"
        :key="post.board_idx"
        class="posts"
      >
        <router-link :to="`/board/${post.board_idx}/view`">
          <article class="post">
            <header>
              <div class="content-wrapper">
                <h3>{{ post.title }}</h3>
                <div class="info">
                  <span><small>{{ new Date(post.reg_dt).toLocaleDateString() }}</small></span>&nbsp;
                  <span><small>{{ post.nick_nm }}</small></span>&nbsp;
                  <span><small><font-awesome-icon icon="eye" /> {{ post.view_cnt }}</small></span>&nbsp;
                </div>
              </div>
              <div
                v-show="showThumbnail"
                class="thumbnail"
              >
                <img
                  src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4"
                  alt="gravatar"
                >
              </div>
            </header>
            <div class="replies">
              <span>{{ post.comments.length }}</span>
              <h6>댓글</h6>
            </div>
          </article>
        </router-link>
      </div>
      <a class="view-more">
        <small>게시물 더보기</small>
      </a>
    </div>
    <div
      v-else
      class="no-posts"
    >
      <span class="has-text-centered">찾으시는 게시물이 없네요.<br><small v-show="$route.query.keyword">다른 검색어를 이용해보세요.</small></span>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    showHeader: Boolean,
    showThumbnail: Boolean,
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
section.popular {
  background: #fff;
  > header {
    line-height: 1;
    text-align: center;
    padding: 1rem 0;
    border-top: 1px solid rgba(0,0,0,.2);
  }
  > .posts > .posts {
    border-top: 1px solid rgba(0,0,0,.2);
    border-bottom: 1px solid rgba(0,0,0,.2);
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
        grid-template-columns: 4fr 1fr;
        width: 100%;
        padding: .6rem .8rem;
        overflow: hidden;
        > .content-wrapper {
          > h3 {
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
        padding: 2rem;
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

a.view-more {
  display: block;
  width: 100%;
  color: #000;
  text-align: center;
  &:hover {
    color: #fff;
    background: #333;
  }
}

.no-posts {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style>
