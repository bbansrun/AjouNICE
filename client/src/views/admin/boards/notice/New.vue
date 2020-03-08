<template>
  <section class="notice">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 공지사항 작성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="title">제목</label>
        <div class="input-form-wrapper">
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            no-validate
            placeholder="제목을 입력하세요"
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
      <div class="input-form-group">
        <label for="content">내용</label>
        <div class="input-form-wrapper">
          <ckeditor
            v-model="form.body"
            name="textarea"
            :editor="editor"
            :config="editorConfig"
          />
          <p
            v-show="validation.body === false"
            :class="{'error': validation.body === false}"
            class="auto-validate-noti"
          >
            입력된 내용이 없습니다.
          </p>
        </div>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          @click="submit"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 공지사항 등록</span>
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
import gql from 'graphql-tag'
import { modPost } from '@/assets/graphql/mutations'
import { ClassicEditor, editorConfig } from '@/vendor/ckeditor'
export default {
  data () {
    return {
      editor: ClassicEditor,
      editorConfig,
      form: {
        title: '',
        body: '<p></p>',
        user_idx: this.$store.state.user.idx,
        ip: this.$store.state.user.access_loc
      },
      validation: {
        title: null,
        body: null
      },
      validated: false
    }
  },
  watch: {
    'form.title' (value) {
      this.validateInput('title')
    },
    'form.body' (value) {
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
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
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    submit () {
      this.validate()
      if (this.validated) {
        this.$apollo.mutate({
          mutation: gql`${modPost}`,
          variables: {
            mode: 'CREATE',
            options: {
              ...this.form,
              category_idx: 1
            }
          }
        }).then(({ data: { modPost } }) => {
          if (modPost) {
            this.flashSuccess('공지사항이 게시되었습니다.')
            this.$router.push('/gate/manager/notice')
          }
        })
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '작성하지 않은 항목이 있습니다.',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          ariaRole: 'alertdialog',
          ariaModal: true,
          confirmText: '확인'
        })
      }
    }
  }
}
</script>

<style>

</style>
