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
              <input
                id="name"
                v-model="name"
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                required
                pattern=".{1,}"
              >
            </div>
            <div class="input-form-group">
              <label for="email">이메일</label>
              <div class="input-form-wrapper">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  name="email"
                  placeholder="이메일 주소를 입력해주세요"
                  required
                  :class="{ 'error': emailError }"
                >
                <p
                  v-if="emailError"
                  class="auto-validate-noti"
                  :class="{ 'error': emailError }"
                >
                  {{ emailErrorMsg }}
                </p>
              </div>
            </div>
            <div class="input-form-group editor">
              <label for="textarea">내용</label>
              <div class="input-form-wrapper">
                <ckeditor
                  v-model="editorData"
                  name="textarea"
                  :editor="editor"
                  :config="editorConfig"
                />
                <p
                  v-if="editorError"
                  class="auto-validate-noti"
                  :class="{ 'error': editorError }"
                >
                  {{ editorErrorMsg }}
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
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      name: '',
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        toolbar: []
      },
      editorError: false,
      editorErrorMsg: '',
      email: '',
      emailError: false,
      emailErrorMsg: ''
    }
  },
  watch: {
    email (value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (value) {
        if (!re.test(value)) {
          this.emailError = true
          this.emailErrorMsg = '이메일 형식이 잘못되었습니다.'
        } else {
          this.emailError = false
          this.emailErrorMsg = ''
        }
      } else {
        this.emailError = false
        this.emailErrorMsg = ''
      }
    },
    editorData (value) {
      if (!value) {
        this.editorError = true
        this.editorErrorMsg = '내용이 비어있습니다.'
      } else {
        this.editorError = false
        this.editorErrorMsg = ''
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    contact () {
      if (this.name && (this.email && !this.emailError)) {
        if (this.editorData) {
          this.$apollo.mutate({
            mutation: gql`mutation { sendContactMail(name: "${this.name}", email: "${this.email}", content: "${this.editorData}") }`
          }).then(({ data }) => {
            if (data) {
              this.$swal({
                title: '성공!',
                text: '이메일 발신에 성공하였습니다.',
                footer: '<p>빠른 시일 내에 입력해주신 이메일 주소로 답변을 보내드리겠습니다.</p>',
                type: 'success',
                width: '90vw'
              }).then(() => {
                this.$router.push('/contact')
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
