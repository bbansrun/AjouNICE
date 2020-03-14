<template>
  <main fix-page>
    <section
      data-form-center
      class="auth has-text-centered"
    >
      <header>
        <Logo />
        <small>아주대학교 대표 커뮤니티 서비스</small>
      </header>
      <form
        data-auth-form
        autocomplete="off"
        @submit.prevent
      >
        <div class="wrapper">
          <header data-logo>
            <h2>ADMIN</h2>
            <small>관리자</small>
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
            </div>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import gql from 'graphql-tag'
import Logo from '@/assets/images/AjouNICE_shadow.svg'
import { LoggedInLogger } from '@/assets/graphql/mutations'
import jwt from 'jsonwebtoken'

export default {
  components: { Logo },
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
        const userId = this.userID
        const password = this.password
        this.$store.dispatch('LOGIN', { userId, password })
          .then(({ result }) => {
            jwt.verify(result.access_token, '4j0uN1ce1', (err, { user: { access_loc } }) => {
              if (err) {
                this.$router.push('/error/401')
              } else {
                this.$apollo.mutate({
                  mutation: gql`${LoggedInLogger}`,
                  variables: {
                    id: this.userID,
                    ip: access_loc
                  }
                }).then(({ data: { auth_email_yn } }) => {
                  document.body.classList.toggle('loading')
                  if (auth_email_yn === 'N') {
                    this.$store.dispatch('LOGOUT').then(() => {
                      this.$router.push('/error/401')
                    })
                  } else {
                    document.body.classList.remove('auth')
                    this.$router.push('redirect' in params ? params.redirect : '/gate/manager')
                  }
                })
              }
            })
          })
          .catch(({ response }) => {
            document.body.classList.toggle('loading')
            if (response.status === 500) {
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
