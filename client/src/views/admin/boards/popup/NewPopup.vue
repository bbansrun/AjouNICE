<template>
  <section class="popup">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 팝업 생성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_nm">제목</label>
        <input
          id="title"
          v-model="title"
          type="text"
          name="title"
          placeholder="제목을 입력해주세요"
          required
          pattern=".{1,}"
        >
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          expanded
          @click="createNewModule"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 팝업 생성</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      titleError: false,
      titleErrorMsg: '',
      category_nm: ''
    }
  },
  methods: {
    createNewModule () {

    }
  }
}
</script>

<style>

</style>
