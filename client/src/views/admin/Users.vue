<template>
  <section class="users">
    <header class="underline underline-inline-block underline-animated">
      <strong>사용자 현황 및 관리</strong>
    </header>
    <hr>
    <b-table :data="users" :columns="columns" :mobile-cards="false"></b-table>
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
        { field: 'nick_nm', label: '닉네임' },
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
