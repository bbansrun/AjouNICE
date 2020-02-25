<template>
  <section class="status gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 모듈 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/boards/gourmet/new/module"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 맛집 모듈</span>
      </b-button>
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/boards/gourmet/new/place"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 맛집 등록</span>
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
          width="5%"
          numeric
          sortable
        >
          {{ props.row.category_idx }}
        </b-table-column>
        <b-table-column
          field="category_nm"
          label="모듈명"
          width="50%"
          sortable
        >
          <strong>{{ props.row.category_nm }}</strong>
        </b-table-column>
        <b-table-column
          field="title"
          label="영문명"
          width="15%"
          sortable
        >
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="category_icon"
          label="아이콘"
          width="5%"
        >
          <figure>
            <img
              :src="props.row.category_icon"
              :alt="`[Gourmet] '${props.row.title}' Icon`"
            >
          </figure>
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
        category_type: 'GOURMET'
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
        text: `맛집 ${name} 모듈을 삭제하시겠습니까?`,
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
