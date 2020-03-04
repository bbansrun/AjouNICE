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
      :loading="loading"
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
          <router-link :to="`/gate/manager/boards/gourmet/${props.row.category_idx}`">
            <strong>{{ props.row.category_nm }}</strong>
          </router-link>
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
              type="is-light"
              size="is-small"
              tag="router-link"
              :to="`/gate/manager/boards/gourmet/${props.row.category_idx}/edit`"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="removeCategory(props.row.category_nm, props.row.category_idx)"
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
import { AllCates } from '@/assets/graphql/queries'
import { modCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      loading: true
    }
  },
  apollo: {
    boards: {
      query: gql`${AllCates}`,
      variables: {
        depth: 0,
        category_type: 'GOURMET'
      },
      fetchPolicy: 'network-only'
    }
  },
  watch: {
    boards (value) {
      if (value) {
        this.loading = false
      }
    }
  },
  methods: {
    removeCategory (name, id) {
      this.$buefy.dialog.prompt({
        title: `'${name}' 삭제`,
        message: `맛집 <strong>${name}</strong> 모듈을 삭제하시겠습니까?<br>관련 게시물 모두 함께 삭제됩니다.<br>진행하시려면 <strong>확인</strong>을 입력해주세요.`,
        inputAttrs: {
          placeholder: '\'확인\'을 입력해주세요.',
          maxlength: 2
        },
        confirmText: '삭제',
        cancelText: '취소',
        type: 'is-danger',
        hasIcon: true,
        icon: 'exclamation-triangle',
        trapFocus: true,
        onConfirm: (value) => {
          if (value === '확인') {
            document.body.classList.add('loading')
            this.$apollo.mutate({
              mutation: gql`${modCategory}`,
              variables: {
                mode: 'DESTROY',
                options: {
                  category_idx: parseInt(id)
                }
              }
            }).then(({ data: { modCategory } }) => {
              if (modCategory) {
                document.body.classList.remove('loading')
                this.boards = _.remove(this.boards, (item) => (item.category_idx !== id))
                this.$buefy.toast.open(`${name} 모듈이 삭제되었습니다.`)
              }
            }).catch(error => {
              console.error(error)
            })
          } else {
            this.$buefy.toast.open('입력값 오류. 취소되었습니다.')
          }
        },
        onCancel: () => this.$buefy.toast.open('취소되었습니다.')
      })
    }
  }
}
</script>

<style>

</style>
