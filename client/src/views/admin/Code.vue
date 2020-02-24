<template>
  <section class="codes">
    <header class="underline underline-inline-block underline-animated">
      <strong>학부/학과 코드관리</strong>
    </header>
    <article>
      <b-table
        :data="data"
        :mobile-cards="false"
      >
        <template slot-scope="props">
          <b-table-column
            field="type"
            label="구분"
            sortable
          >
            {{ props.row.type }}
          </b-table-column>

          <b-table-column
            field="code"
            label="코드"
            sortable
          >
            {{ props.row.code }}
          </b-table-column>

          <b-table-column
            field="value"
            label="값"
            sortable
          >
            <strong>{{ props.row.value }}</strong>
          </b-table-column>

          <b-table-column
            field="settings"
            label="설정"
          >
            <div class="buttons">
              <b-button
                type="is-warning"
                size="is-small"
              >
                <font-awesome-icon icon="exclamation-triangle" />&nbsp;
                <span>수정</span>
              </b-button>
              <b-button
                type="is-danger"
                size="is-small"
              >
                <font-awesome-icon icon="times" />&nbsp;
                <span>삭제</span>
              </b-button>
            </div>
          </b-table-column>
        </template>
      </b-table>
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
        { field: 'value', label: '값' }
      ],
      data: []
    }
  },
  beforeMount () {
    const data = []
    this.$apollo.query({
      query: gql`${Codes}`
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
