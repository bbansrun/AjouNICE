<template>
  <div
    class="wrapper"
    fix-page
  >
    <section data-form-center>
      <header>
        <h1 data-logo>
          AjouNICE!
        </h1>
        <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
      </header>
      <form
        data-auth-form
        autocomplete="off"
        @submit.prevent
      >
        <header data-logo>
          <h2>Recovery</h2>
          <small>계정 재설정</small>
        </header>
        <div class="input-form-wrapper">
          <div class="input-form">
            <input
              v-model="email"
              type="email"
              placeholder="이메일"
              required
              :class="{ 'error': emailError }"
              @keyup.enter="resetAccount"
            >
            <p
              v-if="emailError"
              class="auto-validate-noti"
              :class="{ 'error': emailError }"
            >
              {{ emailErrorMsg }}
            </p>
          </div>
          <div class="input-form">
            <b-button
              class="is-medium submit"
              type="is-primary"
              @click="resetAccount"
            >
              계정 재설정
            </b-button>
          </div>
        </div>
        <div class="input-form-controls">
          <router-link
            to="/"
            class="underline underline-inline-block"
          >
            <small>처음으로</small>
          </router-link>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'Reset',
  data () {
    return {
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
          this.initError()
        }
      } else {
        this.initError()
      }
    }
  },
  beforeCreate () {
    document.body.classList.add('auth')
  },
  methods: {
    initError () {
      this.emailError = false
      this.emailErrorMsg = ''
    },
    resetAccount () {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.email) {
        if (re.test(this.email)) {
          this.$apollo.query({
            query: gql`{ findEmail(email: "${this.email}") { email } }`
          }).then(result => {
            if (result.data.findEmail.length > 0) {
              this.$apollo.mutate({
                mutation: gql`mutation { resetEmailToken(email: "${this.email}") }`
              }).then(result => {
                if (result.data.resetEmailToken) {
                  this.$swal({
                    type: 'success',
                    width: '90vw',
                    title: '재설정 이메일 발송',
                    text: '패스워드 재설정 이메일을 입력하신 주소로 발송하였습니다. 수신함을 확인해주세요.',
                    footer: '<p>스팸으로 분류되는 경우도 발생할 수 있으니 수신되지 않은 경우 해당 문서함을 확인해주세요.</p>'
                  }).then(result => {
                    window.location = '/'
                  })
                }
              })
            } else {
              this.emailError = true
              this.emailErrorMsg = '존재하지 않는 계정입니다.'
            }
          })
        }
      } else {
        this.emailError = true
        this.emailErrorMsg = '이메일 형식이 잘못되었습니다.'
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";

</style>
