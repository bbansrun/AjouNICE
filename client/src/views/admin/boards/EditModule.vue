<template>
  <section class="boards">
    <header class="underline underline-inline-block underline-animated">
      <strong>게시판 속성 편집</strong>
    </header>
    <hr>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group" />
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>수정</span>
        </b-button>
        <b-button
          type="is-dark"
          size="is-small"
          @click="$router.go(-1)"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
