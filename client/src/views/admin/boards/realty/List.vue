<template>
  <section class="realty">
    <header class="underline underline-inline-block underline-animated">
      <strong>부동산 게시판 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        :to="`/gate/manager/boards/realty/new`"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 매물 작성</span>
      </b-button>
    </div>
    <hr>
    <b-table />
  </section>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style>

</style>
