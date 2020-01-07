<template>
    <div class="wrapper" data-form-wrapper>
        <flash-message></flash-message>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form method="POST" action="/api/auth/login">
                <header class="logo-font"><span>LOGIN<small text-divider-block>로그인</small></span></header>
                <div class="divider"></div>
                <div class="input-form-wrapper">
                    <div class="input-form">
                        <input type="text"  :class="{ 'error': this.errorValidation.userID && !this.userID }" placeholder="아이디" v-model="userID" pattern=".{6,}" required>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.userID && !this.userID }" v-if="this.errorValidation.userID && !this.userID">칸이 비어있습니다.</p>
                    </div>
                    <div class="input-form">
                        <input type="password" placeholder="패스워드" @keyup.enter="signin" v-model="password" pattern=".{8,}" :class="{ 'error': this.errorValidation.password && !this.password }" required>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.password && !this.password }" v-if="this.errorValidation.password && !this.password">칸이 비어있습니다.</p>
                    </div>
                    <div class="input-form">
                        <input type="button" @click="signin" @submit.prevent value="로그인">
                    </div>
                    <div class="input-form">
                        <router-link to="/auth/reset">계정 재설정</router-link>
                    </div>
                </div>
                <footer>
                    <router-link to="/auth/signup">아직 회원이 아니신가요? 회원가입 &rarr;</router-link>
                </footer>
            </form>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'

Vue.use(VueFlashMessage)

export default {
  name: 'login',
  data () {
    return {
      userID: '',
      password: '',
      errorValidation: {
          userID: false,
          password: false
      }
    }
  },
  methods: {
      signin () {
          if (this.userID && this.password && this.password.length >= 8) {
              document.body.classList.toggle('loading')
              let user_id = this.userID
              let password = this.password
              this.$store.dispatch('LOGIN', { user_id, password })
                .then(() => {
                    window.location = '/home'
                })
                .catch(err => {
                    document.body.classList.toggle('loading')
                    this.$swal({
                        title: '오류!',
                        text: '입력하신 정보가 올바르지 않습니다.',
                        type: 'error',
                        width: '90vw'
                    })
                })
          }
          if (!this.userID) {
              this.errorValidation.userID = true
          }
          if (!this.password) {
              this.errorValidation.password = true
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
