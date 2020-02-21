<template>
  <section class="codes">
      <header class="underline underline-inline-block underline-animated">
          <strong>학부/학과 코드관리</strong>
      </header>
      <article>
          <b-table :columns="columns" :data="data" :mobile-cards="false" />
      </article>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { Codes } from '@/assets/graphql/queries'
export default {
    data () {
        return {
            columns: [
                { field: 'type', label: '구분' },
                { field: 'code', label: '코드' },
                { field: 'value', label: '값' },
            ],
            data: [],
        }
    },
    beforeMount () {
        let data = []
        this.$apollo.query({
            query: gql`${Codes}`,
        }).then(({ data: { colleges, departments } }) => {
            colleges.forEach(item => {
                data.push({ type: '학부', code: item.college_cd, value: item.college_nm })
            })
            departments.forEach(item => {
                data.push({ type: '학과', code: item.dpt_cd, value: item.dpt_nm })
            })
            this.data = data
        })
    }
}
</script>

<style>

</style>