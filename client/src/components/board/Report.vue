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
        this.$swal({
          title: '신고하시겠습니까?',
          text: '검토 후 관리자가 조치하도록 하겠습니다.',
          footer: '신고 이후 취소가 어려우니 신중히 선택해주세요.',
          type: 'question',
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.flashSuccess('신고되었습니다.')
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
