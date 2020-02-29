<template>
  <section class="status popups">
    <header class="underline underline-inline-block underline-animated">
      <strong>팝업 모듈 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/popups/new"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 팝업 생성</span>
      </b-button>
    </div>
    <hr>
    <b-table
      :data="popup"
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
      popup: [{ id: 1 }]
    }
  }
}
</script>

<style>

</style>
