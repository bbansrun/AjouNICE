<template>
  <section class="status gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 모듈 관리 <em>({{ cateInfo.category_nm }})</em></strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-warning"
        size="is-small"
        tag="router-link"
        to="/gate/manager/boards/gourmet/"
      >
        <font-awesome-icon icon="th-list" />&nbsp;
        <span>맛집 모듈 리스트</span>
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
      :loading="loading"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="res_idx"
          label="ID"
          width="5%"
          numeric
          sortable
        >
          {{ props.row.res_idx }}
        </b-table-column>
        <b-table-column
          field="res_nm"
          label="업소명"
          width="20%"
          sortable
        >
          <strong>{{ props.row.res_nm }}</strong>
        </b-table-column>
        <b-table-column
          field="res_info"
          label="소개"
          width="45%"
        >
          {{ props.row.res_info }}
        </b-table-column>
        <b-table-column
          field="res_icon"
          label="아이콘"
          width="5%"
        >
          <figure>
            <img
              :src="props.row.res_icon"
              :alt="`[Gourmet] '${props.row.res_nm}' Icon`"
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
              type="is-light"
              size="is-small"
              tag="router-link"
              :to="`/gate/manager/boards/gourmet/${props.row.category.category_idx}/place/${props.row.res_idx}/edit`"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="removeItem(props.row.res_nm, props.row.res_idx)"
            >
              <font-awesome-icon icon="trash" />&nbsp;
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
import { GourmetListByCate } from '@/assets/graphql/queries'
import { removeGourmet } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      boards: [],
      cateInfo: {},
      loading: true
    }
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${GourmetListByCate}`,
      variables: {
        category_idx: parseInt(this.$route.params.category_idx)
      }
    }).then(({ data: { gourmetsByCate, CateById } }) => {
      this.boards = gourmetsByCate
      this.cateInfo = CateById
      this.loading = false
      if (CateById === null) {
        this.$router.push('/error/404')
      }
    }).catch(error => {
      console.error(error)
      this.$router.push('/error/404')
    })
  },
  methods: {
    removeItem (name, id) {
      const self = this
      this.$buefy.dialog.confirm({
        title: `'${name}' 삭제`,
        message: `맛집 <strong>${name}</strong>을 삭제하시겠습니까?`,
        confirmText: '진행',
        cancelText: '취소',
        type: 'is-warning',
        hasIcon: true,
        icon: 'question',
        onConfirm: () => {
          document.body.classList.add('loading')
          self.$apollo.mutate({
            mutation: gql`${removeGourmet}`,
            variables: {
              resId: parseInt(id)
            }
          }).then(({ data: { removeGourmet } }) => {
            if (removeGourmet) {
              self.boards = _.remove(self.boards, (item) => (item.res_idx !== id))
              document.body.classList.remove('loading')
              self.$buefy.toast.open(`맛집 ${name}이 삭제되었습니다.`)
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
