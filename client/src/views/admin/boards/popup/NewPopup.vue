<template>
  <section class="popups">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 팝업 생성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_nm">제목</label>
        <div class="input-form-wrapper">
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            placeholder="제목을 입력해주세요"
            required
            pattern=".{1,}"
            :class="{'error': validation.title === false}"
          >
          <p
            v-show="validation.title === false"
            class="auto-validate-noti"
            :class="{'error': validation.title === false}"
          >
            제목이 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          @click="createNewModule"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 팝업 생성</span>
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
      form: {
        title: ''
      },
      validation: {
        title: null
      },
      validated: false,
      category_nm: ''
    }
  },
  methods: {
    validateInput (key, compare = null) {
      // Form Data가 적절한 조건 만족하였는지 판단
      // compare의 경우 object type data를 받을 경우,
      // 비교값인 value와 일치/불일치 비교 여부 checkIsCorrect (Boolean)를 전달하여야함
      if (compare) {
        if (Object.prototype.hasOwnProperty.call(compare, 'value') &&
            Object.prototype.hasOwnProperty.call(compare, 'checkIsCorrect')) {
          if (compare.checkIsCorrect) {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] === item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          } else {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] !== item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (this.form[key]) {
          this.validation[key] = true
        } else {
          this.validation[key] = false
        }
      }
    },
    validate () {
      this.validateInput('title')
    },
    createNewModule () {
      this.validate()
      if (this.validated) {
        // 팝업 생성
      }
    }
  }
}
</script>

<style>

</style>
