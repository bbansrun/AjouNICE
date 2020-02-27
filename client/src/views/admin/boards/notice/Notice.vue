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
    <b-table
      :data="notice"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="id"
          label="ID"
        >
          {{ props.row.id }}
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  data () {
    return {
      notice: [{ id: 1 }]
    }
  }
}
</script>

<style>

</style>
