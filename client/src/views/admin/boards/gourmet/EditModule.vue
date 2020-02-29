<template>
  <section class="gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 모듈 편집</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
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

  }
}
</script>

<style>

</style>
