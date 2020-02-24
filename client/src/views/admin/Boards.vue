<template>
  <section class="boards">
    <header class="underline underline-inline-block underline-animated">
      <strong>게시판 현황 및 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/boards/new"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 게시판 모듈 생성</span>
      </b-button>
    </div>
    <hr>
    <b-table
      :data="boards"
      :columns="columns"
      :mobile-cards="false"
    />
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { AllCates } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      boards: [],
      columns: [
        { field: 'category_nm', label: '모듈명' },
        { field: 'title', label: '영문명' },
        { field: 'depth', label: 'Depth' }
      ]
    }
  },
  mounted () {
    this.$apollo.query({
      query: gql`${AllCates}`,
      variables: {
        depth: 0,
        category_type: 'NORMAL'
      }
    }).then(({ data: { boards } }) => {
      this.boards = boards
    })
  }
}
</script>

<style>

</style>
