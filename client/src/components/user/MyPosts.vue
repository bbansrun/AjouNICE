<template>
  <section class="posts">
    <article>
      <header class="underline underline-inline-block">
        나의 게시물
      </header>
      <div class="posts-list">
        <div
          v-for="post in posts"
          :key="post.board_idx"
        >
          <div class="card">
            <div class="card-content">
              <p class="title">
                <a :href="`/board/${post.board_idx}/view`">{{ post.title }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  props: {
    posts: Array
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: .8rem;
  & .title {
    font-size: 1.2rem;
  }
}
</style>
