<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>게시물 수정</strong>
        </header>
        <form
          data-post-form
          autocomplete="off"
          @submit.prevent
        >
          <div class="input-form-group">
            <label for="title">제목</label>
            <div class="input-form-wrapper">
              <input
                id="title"
                v-model="form.options.title"
                type="text"
                name="title"
                placeholder="제목을 입력하세요"
                required
                :class="{'error': validation.options.title === false}"
              >
              <p
                v-show="validation.options.title === false"
                class="auto-validate-noti"
                :class="{'error': validation.options.title === false}"
              >
                제목을 입력하지 않았습니다.
              </p>
            </div>
          </div>
          <div class="input-form-group">
            <label for="textarea">내용</label>
            <div class="input-form-wrapper">
              <ckeditor
                v-model="form.options.body"
                :editor="editor"
                :config="editorConfig"
                name="textarea"
              />
              <p
                v-show="validation.options.body === false"
                class="auto-validate-noti"
                :class="{'error': validation.options.body === false}"
              >
                내용이 입력되지 않았습니다.
              </p>
            </div>
          </div>
          <div class="input-form-controls buttons">
            <b-button
              size="is-small"
              type="is-primary"
              @click="writePost()"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>작성</span>
            </b-button>
            <b-button
              size="is-small"
              type="is-dark"
              @click="$router.go(-1)"
            >
              <font-awesome-icon icon="times" />&nbsp;
              <span>취소</span>
            </b-button>
          </div>
        </form>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Navigation, Footer } from '@/components'
import { BriefPost } from '@/assets/graphql/queries'
import { modPost } from '@/assets/graphql/mutations'
import { ClassicEditor, editorConfig } from '@/vendor/ckeditor'
export default {
  components: {
    Navigation,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      editor: ClassicEditor,
      editorConfig,
      form: {
        mode: 'EDIT',
        options: {
          board_idx: parseInt(this.$route.params.post_id),
          title: '',
          body: '<p></p>',
          ip: this.$store.state.user.access_loc
        }
      },
      validation: {
        options: {
          title: null,
          body: null
        }
      },
      validated: false
    }
  },
  watch: {
    'form.options.title' (value) {
      if (value) {
        this.validation.options.title = true
      }
    },
    'form.options.body' (value) {
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
    }
  },
  apollo: {
    post: {
      query: gql`${BriefPost}`,
      variables () {
        return {
          id: this.$route.params.post_id
        }
      },
      result ({ data: { post: { title, body } }, loading, networkStatus, stale }) {
        this.form.options.title = title
        this.form.options.body = body
      }
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
              this.validation.options[key] = compare.value.every(item => this.form.options[key] === item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          } else {
            if (compare.value instanceof Array) {
              this.validation.options[key] = compare.value.every(item => this.form.options[key] !== item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (this.form.options[key]) {
          this.validation.options[key] = true
        } else {
          this.validation.options[key] = false
        }
      }
    },
    validate () {
      this.validateInput('title')
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
      this.validated = Object.keys(this.validation.options).every((key) => this.validation.options[key])
    },
    writePost () {
      this.validate()
      if (this.validated) {
        document.body.classList.add('loading')
        this.$apollo.mutate({
          mutation: gql`${modPost}`,
          variables: { ...this.form }
        }).then(({ data: { modPost: { result, data } } }) => {
          document.body.classList.remove('loading')
          this.flashSuccess('수정되었습니다.')
          this.$router.push(`/board/${data.board_idx}/view`)
        })
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '<span>작성하지 않은 항목이 있습니다.</span><br><small>누락된 부분을 확인 후 다시 시도해주시기 바랍니다.</small>',
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

<style lang="scss" scoped>
.v-select {
    margin-bottom: 5px;
}
</style>
