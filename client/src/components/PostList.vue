<template>
    <section class="popular">
        <header v-if="showHeader">
          <small>핫이슈</small>
          <h2>주목해야할 게시물</h2>
        </header>
        <div class="posts" :class="{ 'thumbnail': showThumbnail, 'replies': !showThumbnail }" v-for="post in items" :key="post.board_idx">
          <a :href="`./${post.board_idx}/view`">
            <article class="post">
              <header>
                <h3>{{ post.title }}</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>{{ post.nick_nm }}</span></small>
                </p>
              </header>
              <div class="thumbnail" v-if="showThumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
              <div class="replies" v-else>
                  <span>{{ 0 }}</span>
                  <h6>댓글</h6>
              </div>
            </article>
          </a>
        </div>
        <div class="view-more">
          <a href="#">
            <small>게시물 더보기</small>
          </a>
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
  > .posts {
    border-top: 1px solid rgba(0,0,0,.2);
    border-bottom: 1px solid rgba(0,0,0,.2);
    & a {
      display: inline-block;
      color: #000;
    }
    & article {
      width: 100vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 !important;
      margin: 0 !important;
      > header {
        width: 100%;
        padding: 1rem;
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
        justify-content: center;
        align-items: center;
        padding: 2rem;
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
    }
  }
}
</style>
