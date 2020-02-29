<template>
  <section class="gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 업소 상세 편집</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group" />
      <div class="input-form-group" />
      <div class="input-form-group" />
      <div class="input-form-group" />
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          @click="editItem"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>수정</span>
        </b-button>
        <b-button
          type="is-dark"
          size="is-small"
          @click="$router.go(-1)"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  beforeMount () {

  },
  methods: {
    editItem () {
      this.$buefy.dialog.confirm({
        title: '업소 수정',
        message: '수정하시겠습니까?',
        confirmText: '수정',
        cancelText: '취소',
        type: 'is-warning',
        hasIcon: true,
        icon: 'question',
        onConfirm: () => {
          document.body.classList.add('loading')
        //   self.$apollo.mutate({
        //     mutation: gql`${removeGourmet}`,
        //     variables: {
        //       resId: parseInt(id)
        //     }
        //   }).then(({ data: { removeGourmet } }) => {
        //     if (removeGourmet) {
        //       self.boards = _.remove(self.boards, (item) => (item.res_idx !== id))
        //       document.body.classList.remove('loading')
        //       self.$buefy.toast.open(`맛집 ${name}이 수정되었습니다.`)
        //     }
        //   }).catch(error => {
        //     console.error(error)
        //   })
        }
      })
    }
  }
}
</script>

<style>

</style>
