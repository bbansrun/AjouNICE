<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="광고/제휴/기타문의"
      description="개발팀에 궁금한 것이 있으시면 연락주시기 바랍니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual01.jpg"
    />
    <main>
      <div class="wrapper">
        <header class="underline underline-inline-block">
          <strong>문의폼 작성</strong>
        </header>
        <section class="contact">
          <form
            data-post-form
            @submit.prevent
          >
            <div class="input-form-group">
              <label for="name">이름</label>
              <div class="input-form-wrapper">
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="이름을 입력해주세요"
                  required
                  :class="{'error': validation.name === false }"
                  pattern=".{1,}"
                >
                <p
                  v-show="validation.name === false"
                  class="auto-validate-noti"
                  :class="{'error': validation.name === false }"
                >
                  이름이 입력되지 않았습니다.
                </p>
              </div>
            </div>
            <div class="input-form-group">
              <label for="email">이메일</label>
              <div class="input-form-wrapper">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="이메일 주소를 입력해주세요"
                  required
                  :class="{'error': validation.email === false }"
                >
                <p
                  v-show="validation.email === false"
                  class="auto-validate-noti"
                  :class="{'error': validation.email === false }"
                >
                  이메일이 입력되지 않았습니다.
                </p>
              </div>
            </div>
            <div class="input-form-group editor">
              <label for="textarea">내용</label>
              <div class="input-form-wrapper">
                <ckeditor
                  v-model="form.content"
                  name="textarea"
                  :editor="editor"
                  :config="editorConfig"
                  :class="{'error': validation.content === false }"
                />
                <p
                  v-show="validation.content === false"
                  class="auto-validate-noti"
                  :class="{'error': validation.content === false }"
                >
                  내용이 입력되지 않았습니다.
                </p>
              </div>
            </div>
            <div class="input-form-controls buttons">
              <b-button
                type="is-primary"
                @click="contact"
              >
                <font-awesome-icon icon="envelope-open-text" />&nbsp;
                <span>이메일 발송</span>
              </b-button>
            </div>
          </form>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Navigation, Landing, Footer } from '@/components'
import { ClassicEditor, editorConfig } from '@/vendor/ckeditor'
import { Contact } from '@/assets/graphql/mutations'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      editor: ClassicEditor,
      editorConfig,
      form: {
        name: '',
        email: '',
        content: '<p></p>'
      },
      validation: {
        name: null,
        email: null,
        content: null
      },
      validated: false
    }
  },
  watch: {
    'form.name' (value) {
      this.validateInput('name')
    },
    'form.email' (value) {
      this.validateInput('email')
    },
    'form.content' (value) {
      this.validateInput('content', { value: ['<p></p>', ''], checkIsCorrect: false })
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
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
      this.validateInput('name')
      this.validateInput('email')
      this.validateInput('content', { value: ['<p></p>', ''], checkIsCorrect: false })
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    contact () {
      this.validate()
      if (this.validated) {
        this.$apollo.mutate({
          mutation: gql`${Contact}`,
          variables: {
            ...this.form
          }
        }).then(({ data: { sendContactMail } }) => {
          if (sendContactMail) {
            this.$swal({
              title: '성공!',
              text: '이메일 발신에 성공하였습니다.',
              footer: '<p>빠른 시일 내에 입력해주신 이메일 주소로 답변을 보내드리겠습니다.</p>',
              type: 'success',
              width: '90vw'
            }).then(() => {
              this.$router.go(0)
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
