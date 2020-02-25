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
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="category_idx"
          label="ID"
          sortable
          numeric
          width="5%"
        >
          {{ props.row.category_idx }}
        </b-table-column>
        <b-table-column
          field="category_nm"
          label="모듈명"
          sortable
          width="50%"
        >
          <strong>{{ props.row.category_nm }}</strong>
        </b-table-column>
        <b-table-column
          field="title"
          label="영문명"
          sortable
          width="15%"
        >
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="depth"
          label="Depth"
          width="5%"
        >
          {{ props.row.depth }}
        </b-table-column>
        <b-table-column
          field="settings"
          label="설정"
          width="25%"
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
              @click="removeCategory(props.row.category_nm, props.row.category_idx)"
            >
              <font-awesome-icon icon="times" />&nbsp;
              <span>삭제</span>
            </b-button>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { AllCates } from '@/assets/graphql/queries'
import { removeCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      boards: []
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
  },
  methods: {
    removeCategory (name, id) {
      const self = this
      this.$swal({
        type: 'question',
        title: `'${name}' 삭제`,
        text: `게시판 ${name} 모듈을 삭제하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        showLoaderOnConfirm: true,
        preConfirm () {
          return self.$apollo.mutate({
            mutation: gql`${removeCategory}`,
            variables: {
              category_idx: parseInt(id)
            }
          }).then(({ data: { removeCategory } }) => {
            return removeCategory
          }).catch(error => {
            console.error(error)
          })
        }
      }).then((result) => {
        if (result.value) {
          this.boards = _.remove(this.boards, (item) => (item.category_idx !== id))
          this.flashSuccess(`${name} 모듈이 삭제되었습니다.`)
        }
      })
    }
  }
}
</script>

<style>

</style>
