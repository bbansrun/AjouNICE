<template>
    <section class="popular">
        <header v-if="showHeader">
          <small>핫이슈</small>
          <h2>주목해야할 게시물</h2>
        </header>
        <div class="posts" :class="{ 'thumbnail': showThumbnail, 'replies': !showThumbnail }">
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail" v-if="showThumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
              <div class="replies" v-else>
                  <span>{{ 0 }}</span>
              </div>
            </article>
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
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  > .posts {
    & a {
      display: inline-block;
      color: #000;
    }
    & article {
      width: 100vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      > header {
        width: 100%;
        padding: 1rem;
        > p {
          margin-top: auto;
        }
      }
      > .thumbnail {
        max-width: 100px;
        max-height: 100px;
      }
    }
  }
}
</style>