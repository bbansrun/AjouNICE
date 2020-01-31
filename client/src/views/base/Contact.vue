<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="광고/제휴/기타문의"
      description="개발팀에 궁금한 것이 있으시면 연락주시기 바랍니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual01.jpg"
    />
    <div class="container">
      <article>
        <header class="underline underline-inline-block">
          문의폼 작성
        </header>
        <section>
          <form
            data-post-form
            @submit.prevent
          >
            <div class="input-form">
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
            <div class="input-form">
              <label for="email">이메일</label>
              <div class="input-form-group">
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
            <div class="input-form editor">
              <label for="textarea">내용</label>
              <div class="input-form-group">
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
            <div class="input-form-controls">
              <input
                type="submit"
                class="btn btn-submit text-inverse"
                value="이메일 발송"
                @click="contact"
              >
            </div>
          </form>
        </section>
      </article>
    </div>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
export default {
  name: 'Contact',
  components: {
    Navigation, Landing, Footer
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
                window.location = '/contact'
              })
            }
          })
        } else {
          this.$swal({
            title: '오류!',
            text: '내용이 비어있습니다.',
            footer: '<p>문의주실 내용을 입력하여 주시기 바랍니다.</p>',
            type: 'error',
            width: '90vw'
          })
        }
      } else {
        this.$swal({
          title: '오류!',
          text: '빈 항목이 있습니다.',
          footer: '<p>해당 항목을 입력하여 주시기 바랍니다.</p>',
          type: 'error',
          width: '90vw'
        })
      }
    }
  }
}
</script>

<style lang="scss">

article {
    margin-top: 2rem !important;
    padding: 0 2rem !important;
    & header {
        font-weight: bold;
        font-size: 1.5rem;
        & span {
            position: relative;
            &::before {
                content: "";
                display: block;
                position: absolute;
                left: 0;
                z-index: -1;
                bottom: 1px;
                height: 10px;
                background-color: #667eea;
                transition: all .4s cubic-bezier(0.57, 0.02, 0.06, 1);
                width: 100%;
            }
        }
    }
}
</style>
