<template>
  <section class="notice">
    <header class="underline underline-inline-block underline-animated">
      <strong>공지사항 수정</strong>
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
        <label for="body">내용</label>
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
import gql from 'graphql-tag'
import { ClassicEditor, editorConfig } from '@/vendor/ckeditor/index'
import { Post } from '@/assets/graphql/queries'
import { modPost } from '@/assets/graphql/mutations'

export default {
  data () {
    return {
      editor: ClassicEditor,
      editorConfig,
      form: {
        title: '',
        body: '<p></p>'
      },
      validation: {
        title: null,
        body: null
      },
      validated: false
    }
  },
  apollo: {
    post: {
      query: gql`${Post}`,
      variables () {
        return {
          id: this.$route.params.notice_idx
        }
      },
      result ({ data: { post } }) {
        this.form.title = post.title
        this.form.body = post.body
      }
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
        this.$buefy.dialog.confirm({
          title: '수정',
          message: '수정하시겠습니까?',
          confirmText: '수정',
          cancelText: '취소',
          type: 'is-warning',
          hasIcon: true,
          icon: 'question',
          onConfirm: () => {
            document.body.classList.add('loading')
            this.$apollo.mutate({
              mutation: gql`${modPost}`,
              variables: {
                mode: 'EDIT',
                options: {
                  ...this.form,
                  board_idx: parseInt(this.$route.params.notice_idx),
                  ip: this.$store.state.user.access_loc
                }
              }
            }).then(({ data: { modPost } }) => {
              document.body.classList.remove('loading')
              if (modPost) {
                this.flashSuccess('수정되었습니다.')
                this.$router.push('/gate/manager/notice')
              }
            })
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
