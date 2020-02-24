<template>
  <section class="users">
    <header class="underline underline-inline-block underline-animated">
      <strong>사용자 현황 및 관리</strong>
    </header>
    <hr>
    <b-table
      :data="users"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="user_idx"
          label="ID"
          width="5"
          numeric
          sortable
        >
          {{ props.row.user_idx }}
        </b-table-column>

        <b-table-column
          field="user_nm"
          label="이름"
          sortable
        >
          {{ props.row.user_nm }}
        </b-table-column>

        <b-table-column
          field="nick_nm"
          label="닉네임"
          sortable
        >
          {{ props.row.nick_nm }}
        </b-table-column>

        <b-table-column
          label="설정"
        >
          <b-button
            type="is-danger"
            size="is-small"
          >
            <font-awesome-icon icon="times" />&nbsp;
            <span>삭제</span>
          </b-button>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { Users } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      users: [],
      columns: [
        { field: 'user_idx', label: 'ID' },
        { field: 'user_nm', label: '이름' },
        { field: 'nick_nm', label: '닉네임' }
      ]
    }
  },
  mounted () {
    this.$apollo.query({
      query: gql`${Users}`
    }).then(({ data: { users } }) => {
      this.users = users
    })
  }
}
</script>

<style>

</style>
