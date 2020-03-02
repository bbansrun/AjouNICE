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
      :data="notice"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="id"
          label="ID"
        >
          {{ props.row.id }}
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
              :to="`/gate/manager/notice/${props.row.id}/edit`"
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
export default {
  data () {
    return {
      notice: [{ id: 1 }]
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
