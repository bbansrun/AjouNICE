<template>
  <section class="notice">
    <header class="underline underline-inline-block underline-animated">
      <strong>공지사항 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/notice/new"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>공지사항 작성</span>
      </b-button>
    </div>
  </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
