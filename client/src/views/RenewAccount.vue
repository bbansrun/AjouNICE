<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form @submit.prevent autocomplete="off">
                <header class="logo-font">Reset Account<small text-divider-block>계정 재설정</small></header>
                <div class="divider"></div>
                <div class="input-form-wrapper">
                  <div class="input-form">
                      <input type="email" placeholder="이메일" v-model="email" @keyup.enter="resetAccount" @submit.prevent required :class="{ 'error': this.emailError }">
                      <p class="auto-validate-noti" :class="{ 'error': this.emailError }" v-if="this.emailError">{{ this.emailErrorMsg }}</p>
                  </div>
                  <div class="input-form">
                      <input type="button" @click="resetAccount" value="계정 재설정">
                  </div>
                  <div class="input-form">
                    <router-link to="/">처음으로</router-link>
                  </div>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'reset',
  data () {
    return {
      email: '',
      emailError: false,
      emailErrorMsg: ''
    }
  },
  watch: {
    email (value) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
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
  methods: {
    initError () {
      this.emailError = false
      this.emailErrorMsg = ''
    },
    resetAccount () {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.email) {
        if (re.test(this.email)) {
          this.$apollo.query({
            query: gql`{ findEmail(email: "${this.email}") { email } }`
          }).then(result => {
            if (result.data.findEmail.length > 0) {
              this.$swal({
                type: 'success',
                width: '90vw',
                title: '재설정 이메일 발송',
                text: '패스워드 재설정 이메일을 입력하신 주소로 발송하였습니다. 받은 문서함을 확인해주세요.',
                footer: '스팸으로 분류되는 경우도 발생할 수 있으니 수신되지 않은 경우 해당 문서함을 확인해주세요.'
              }).then(result => {
                window.location = '/'
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
  },
  beforeCreate () {
    document.body.classList.add('auth')
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
@import "~@/assets/styles/auth";
</style>
