<template>
  <section class="boards">
    <header class="underline underline-inline-block underline-animated">
      <strong>게시물 관리 ({{ board.category_nm }} 게시판)</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/boards/"
      >
        <font-awesome-icon icon="th-list" />&nbsp;
        <span>목록으로</span>
      </b-button>
    </div>
    <hr>
    <b-table
      :data="posts"
      :mobile-cards="false"
      :loading="loading"
    >
      <template slot-scope="props">
        <b-table-column
          field="board_idx"
          label="ID"
          numeric
          sortable
          width="10%"
        >
          {{ props.row.board_idx }}
        </b-table-column>
        <b-table-column
          field="title"
          label="제목"
          sortable
          width="60%"
        >
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="settings"
          label="설정"
          width="30%"
        >
          <div class="buttons">
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <b-button
                slot="trigger"
                type="is-warning"
                size="is-small"
              >
                <font-awesome-icon icon="user-cog" />&nbsp;
                <span>제재</span>
              </b-button>
              <b-dropdown-item aria-role="listitem">
                일시숨김
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                경고처리
              </b-dropdown-item>
            </b-dropdown>&nbsp;
            <b-button
              type="is-danger"
              size="is-small"
              @click="removeItem(props.row.board_idx)"
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
import { PostsByCate, CateById } from '@/assets/graphql/queries'
import { modPost } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      loading: true
    }
  },
  apollo: {
    board: {
      query: gql`${CateById}`,
      variables () {
        return {
          id: parseInt(this.$route.params.category_idx)
        }
      },
      update: data => data.boardById
    },
    posts: {
      query: gql`${PostsByCate}`,
      variables () {
        return {
          category_idx: parseInt(this.$route.params.category_idx)
        }
      }
    }
  },
  watch: {
    posts (value) {
      if (value) {
        this.loading = false
      }
    }
  },
  methods: {
    removeItem (id) {
      this.$buefy.dialog.confirm({
        title: '게시물 삭제',
        message: '게시물을 삭제하시겠습니까?',
        confirmText: '삭제',
        cancelText: '취소',
        type: 'is-danger',
        hasIcon: true,
        icon: 'exclamation-triangle',
        onConfirm: () => {
          document.body.classList.add('loading')
          this.$apollo.mutate({
            mutation: gql`${modPost}`,
            variables: {
              mode: 'DESTROY',
              options: {
                board_idx: parseInt(id)
              }
            }
          }).then(({ data: { removePost } }) => {
            document.body.classList.remove('loading')
            this.flashSuccess('게시물과 부속 댓글을 삭제하였습니다.')
            this.posts = _.filter(this.posts, (item) => (item.board_idx !== id))
          }).catch(error => {
            console.error(error)
            this.flashError('알 수 없는 에러가 발생하였습니다.')
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
