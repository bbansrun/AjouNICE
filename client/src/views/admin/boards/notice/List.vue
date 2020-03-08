<template>
  <section class="notice">
    <header class="underline underline-inline-block underline-animated">
      <strong>공지사항 관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/notice/new"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>공지사항 작성</span>
      </b-button>
    </div>
    <b-table
      :data="posts"
      :mobile-cards="false"
      :loading="loading"
    >
      <template slot-scope="props">
        <b-table-column
          field="board_idx"
          label="ID"
        >
          {{ props.row.board_idx }}
        </b-table-column>

        <b-table-column
          field="title"
          label="제목"
        >
          <strong>{{ props.row.title }}</strong>
        </b-table-column>

        <b-table-column
          field="view_cnt"
          label="조회수"
        >
          {{ props.row.view_cnt }}
        </b-table-column>

        <b-table-column
          field="user_nm"
          label="작성자"
        >
          {{ props.row.user.user_nm }}
        </b-table-column>

        <b-table-column
          field="settings"
          label="설정"
        >
          <div class="buttons">
            <b-button
              type="is-light"
              size="is-small"
              tag="router-link"
              :to="`/gate/manager/notice/${props.row.board_idx}/edit`"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="removeItem(props.row.id)"
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
import gql from 'graphql-tag'
import { ServiceNotice } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      posts: [],
      loading: true
    }
  },
  apollo: {
    posts: {
      query: gql`${ServiceNotice}`,
      result ({ data }) {
        this.posts = data.boards[0].posts
        this.loading = false
      },
      fetchPolicy: 'network-only'
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
        }
      })
    }
  }
}
</script>

<style>

</style>
