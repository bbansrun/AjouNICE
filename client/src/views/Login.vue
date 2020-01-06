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
                        <input type="text" placeholder="아이디" v-model="userID" pattern=".{6,}" required>
                    </div>
                    <div class="input-form">
                        <input type="password" placeholder="패스워드" @keyup.enter="signin" v-model="password" pattern=".{8,}" required>
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
      formErrors: [],
      userID: '',
      password: ''
    }
  },
  methods: {
      signin () {
          if (this.userID && this.password && this.password.length >= 8) {
              document.body.classList.add('loading')
              this.$Axios({
                url: '/api/auth/login',
                method: 'POST',
                data: {
                    'user_id': this.userID,
                    'password': this.password
                }
              }).then(result => {
                document.body.classList.remove('loading')
                window.location = '#/home'
              }).catch(error => {
                document.body.classList.remove('loading')
                if (error.response.status === 500) {
                    this.$swal({
                        title: '오류!',
                        text: '입력하신 정보가 올바르지 않습니다.',
                        type: 'error',
                        width: '90vw'
                    })
                }
              })
          }
      }
  },
  beforeCreate () {
    document.body.className = 'auth'
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
