<template>
  <section class="replies">
    <article>
      <header class="underline underline-inline-block">
        <h3>{{ 0 }}개의 댓글이 달렸습니다.</h3>
      </header>
    </article>
    <form
      class="reply edit"
      autocomplete="off"
    >
      <div class="input-form">
        <input
          id="reply"
          type="text"
          name="reply"
          placeholder="댓글을 작성하세요."
          no-validate
        >
        <button>작성</button>
      </div>
    </form>
    <div class="replies-view">
      <div class="card reply">
        <div class="content">
          <header>{{ '작성자' }}</header>
          <p>{{ '내용' }}</p>
        </div>
        <div class="controls">
          <button />
        </div>
      </div>
      <div class="card reply">
        <div class="content">
          <header>{{ '작성자' }}</header>
          <p>{{ '내용' }}</p>
        </div>
        <div class="controls">
          <button />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.reply {
  display: grid;
  grid-template-columns: 6fr 1fr;
}
</style>
