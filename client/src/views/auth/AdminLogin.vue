<template>
  <div
    class="wrapper"
    fix-page
  >
    <flash-message />
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
          <h2>ADMIN</h2>
          <small>관리자 로그인</small>
        </header>
        <div class="divider" />
        <div class="input-form-wrapper">
          <div class="input-form">
            <input
              v-model="userID"
              type="text"
              :class="{ 'error': errorValidation.userID && !userID }"
              placeholder="아이디"
              pattern=".{6,}"
              required
            >
            <p
              v-if="errorValidation.userID && !userID"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.userID && !userID }"
            >
              칸이 비어있습니다.
            </p>
          </div>
          <div class="input-form">
            <input
              v-model="password"
              type="password"
              placeholder="패스워드"
              pattern=".{8,}"
              :class="{ 'error': errorValidation.password && !password }"
              required
              @keyup.enter="signin"
            >
            <p
              v-if="errorValidation.password && !password"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.password && !password }"
            >
              칸이 비어있습니다.
            </p>
          </div>
          <div class="input-form">
            <input
              type="button"
              value="로그인"
              @click="signin"
              @submit.prevent
            >
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'
import gql from 'graphql-tag'

Vue.use(VueFlashMessage)

export default {
  name: 'Login',
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
  beforeCreate () {
    document.body.classList.add('auth')
  },
  methods: {
    signin () {
      const params = this.$route.params
      if (this.userID && this.password && this.password.length >= 8) {
        document.body.classList.toggle('loading')
        const user_id = this.userID
        const password = this.password
        this.$store.dispatch('LOGIN', { user_id, password })
          .then(({ result }) => {
            this.$Axios.get('/api/reqClientIP').then(client => {
              this.$apollo.mutate({
                mutation: gql`mutation { lastLogin(userId: "${this.userID}", ip: "${client.data.result.ip}") }`
              })
            })
            if (result.auth_email_yn === 'N') {
              this.$store.dispatch('LOGOUT')
              window.location = '/error/401'
            } else {
              if ('redirect' in params) {
                window.location = params.redirect
              } else {
                window.location = '/gate/manager'
              }
            }
          })
          .catch(err => {
            console.error(err)
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
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";

</style>
