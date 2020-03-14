<template>
  <div class="wrapper">
    <header data-logo>
      <h2>LOGIN</h2>
      <small>로그인</small>
    </header>
    <div class="input-form">
      <div class="input-form-wrapper">
        <div class="input-form-group">
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
        <div class="input-form-group">
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
        <div class="input-form-group buttons">
          <b-button
            class="is-medium submit"
            size="is-medium"
            type="is-dark"
            expanded
            @click="signin"
          >
            <font-awesome-icon icon="key" />&nbsp;
            <span>로그인</span>
          </b-button>
        </div>
        <div class="input-form-controls">
          <router-link
            to="/auth/recovery"
            class="underline underline-inline-block"
          >
            <small>계정 재설정</small>
          </router-link>
        </div>
      </div>
      <footer class="auth-footer buttons">
        <b-button
          class="is-medium"
          size="is-medium"
          type="is-info"
          expanded
          tag="router-link"
          to="/auth/signup"
        >
          <font-awesome-icon icon="user-plus" />&nbsp;
          <span>회원가입</span>
        </b-button>
      </footer>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { LoggedInLogger } from '@/assets/graphql/mutations'
import jwt from 'jsonwebtoken'

export default {
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
    updateSignInLog (ip) {
      const queries = this.$route.query
      this.$apollo.mutate({
        mutation: gql`${LoggedInLogger}`,
        variables: {
          id: this.userID,
          ip
        }
      }).then(({ data: { lastLogin: { auth_email_yn } } }) => {
        document.body.classList.remove('loading')
        if (auth_email_yn === 'N') {
          this.$store.dispatch('LOGOUT').then(() => {
            this.$router.push('/error/401')
          })
        } else {
          document.body.classList.remove('auth')
          this.$router.push(Object.prototype.hasOwnProperty.call(queries, 'redirect') ? queries : '/')
        }
      })
    },
    signin () {
      if (this.userID && this.password && this.password.length >= 8) {
        document.body.classList.add('loading')
        const userId = this.userID
        const password = this.password
        this.$store.dispatch('LOGIN', { userId, password })
          .then(({ result: { access_token } }) => {
            jwt.verify(access_token, '4j0uN1ce1', (err, { user: { access_loc } }) => {
              if (err) {
                this.$router.push('/error/401')
              } else {
                this.updateSignInLog(access_loc)
              }
            })
          })
          .catch(({ response: { status } }) => {
            document.body.classList.remove('loading')
            if (status === 500) {
              this.$router.push('/error/500')
            } else {
              this.$buefy.dialog.alert({
                title: '에러',
                message: '입력하신 정보가 올바르지 않습니다.',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                ariaRole: 'alertdialog',
                ariaModal: true,
                confirmText: '확인'
              })
            }
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

<style lang="scss" scoped>
.input-form-group.buttons {
  margin: {
    top: .8rem;
  }
}

footer.auth-footer {
  padding: 0 2rem;
}
</style>

<style lang="scss" scoped>
.btn {
    font-size: 1rem;
    margin-top: 1rem;
    padding: .5rem 4rem;
    background: #373B44;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #4286f4, #373B44);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #4286f4, #373B44);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
