<template>
  <section class="status gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 모듈 관리</strong>
    </header>
    <div class="buttons">
      <b-button type="is-primary" size="is-small" tag="router-link" to="/gate/manager/boards/gourmet/new">
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 맛집 게시</span>
      </b-button>
    </div>
    <hr>
    <b-table :data="boards" :columns="columns" :mobile-cards="false"></b-table>
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
        { field: 'title', label: '영문명' }
      ]
    }
  },
  mounted () {
    this.$apollo.query({
      query: gql`${AllCates}`,
      variables: {
        depth: 0,
        category_type: "GOURMET"
      }
    }).then(({ data: { boards }}) => {
      this.boards = boards
    })
  }
}
</script>

<style>

</style>
