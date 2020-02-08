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
          <header>{{ post.title }}</header>
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

<style>

</style>
