<template>
  <section class="popular">
    <header v-if="showHeader">
      <small>핫이슈</small>
      <h2>주목해야할 게시물</h2>
    </header>
    <div
      v-if="items.length > 0"
      class="posts"
    >
      <div
        v-for="post in items"
        :key="post.board_idx"
        class="posts"
        :class="{ 'thumbnail': showThumbnail, 'replies': !showThumbnail }"
      >
        <router-link :to="`/board/${post.board_idx}/view`">
          <article class="post">
            <header>
              <h3>{{ post.title }}</h3>
              <div class="info">
                <span><small>{{ new Date(post.reg_dt).toLocaleDateString() }}</small></span>&nbsp;
                <span><small>{{ post.nick_nm }}</small></span>&nbsp;
                <span><small><font-awesome-icon icon="eye" /> {{ post.view_cnt }}</small></span>&nbsp;
              </div>
            </header>
            <div
              v-if="showThumbnail"
              class="thumbnail"
            >
              <img
                src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4"
                height="100"
                alt="gravatar"
              >
            </div>
            <div
              v-else
              class="replies"
            >
              <span>{{ post.comments.length }}</span>
              <h6>댓글</h6>
            </div>
          </article>
        </router-link>
      </div>
      <div class="view-more">
        <a href="#">
          <small>게시물 더보기</small>
        </a>
      </div>
    </div>
    <div
      v-else
      class="no-posts"
    >
      <span>아직 게시물이 없어요.</span>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    showHeader: Boolean,
    showThumbnail: Boolean,
    items: Array
  },
  computed: {
    retnPostLink (idx) {
      return `/board/1/1/${idx}`
    }
  }
}
</script>

<style lang="scss">
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        padding: .6rem .8rem;
        overflow: hidden;
        > h3 {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > p {
          margin-top: auto;
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
  > .view-more {
    & a {
      display: inline-block;
      width: 100%;
      color: #000;
      text-align: center;
      padding: .5rem 0;
      &:hover {
        background: #333;
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
