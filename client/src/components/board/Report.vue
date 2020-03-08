<template>
  <div class="report">
    <input
      id="report"
      v-model="reasonReport"
      type="text"
      name="report"
      placeholder="신고 사유를 작성해주세요."
      no-validate
      required
    >
    <b-button
      size="is-small"
      type="is-danger"
      @click="report"
    >
      <font-awesome-icon icon="pen" />&nbsp;
      <span>전송</span>
    </b-button>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { modReport } from '@/assets/graphql/mutations'
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      reasonReport: ''
    }
  },
  methods: {
    report () {
      if (this.reasonReport) {
        this.$buefy.dialog.confirm({
          confirmText: '삭제',
          cancelText: '취소',
          type: 'is-warning',
          hasIcon: true,
          icon: 'exclamation-triangle',
          title: '신고하시겠습니까?',
          message: '검토 후 관리자가 조치하도록 하겠습니다. 신고 이후 취소가 어려우니 신중히 선택해주세요.',
          onConfirm () {
            this.$apollo.mutate({
              mutation: gql`${modReport}`,
              variables: {
                mode: 'CREATE',
                options: {
                  user_idx: this.$store.state.user.idx,
                  text: this.reasonReport,
                  ip: this.$store.state.user.access_loc
                }
              }
            })
          }
        })
      } else {
        this.flashError('신고 내용을 입력해주세요.')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report {
  display: flex;
  flex: {
    direction: row;
  }
  justify-content: space-between;
  align-items: center;
  > input[type="text"] {
    margin: {
      right: .5rem;
    }
  }
}
</style>
