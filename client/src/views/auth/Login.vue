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
        <h2>회원 로그인</h2>
        <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
      </header>
      <form
        data-auth-form
        autocomplete="off"
        @submit.prevent
      >
        <header data-logo>
          <h2>LOGIN</h2>
          <small>로그인</small>
        </header>
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
            <b-button
              class="is-medium submit"
              type="is-primary"
              @click="signin"
            >
              로그인
            </b-button>
          </div>
        </div>
        <div class="input-form-controls">
          <router-link
            to="/auth/reset"
            class="underline underline-inline-block"
          >
            <small>계정 재설정</small>
          </router-link>
          <router-link
            to="/auth/signup"
            class="btn rounded box-shadow text-inverse"
          >
            회원가입 &rarr;
          </router-link>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'

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
        const userId = this.userID
        const password = this.password
        this.$store.dispatch('LOGIN', { userId, password })
          .then(({ result }) => {
            jwt.verify(result.access_token, '4j0uN1ce1', (err, { user: { access_loc } }) => {
              if (err) {
                this.$router.push('/error/401')
              } else {
                this.$apollo.mutate({
                  mutation: gql`mutation { lastLogin(userId: "${this.userID}", ip: "${access_loc}") }`
                }).then((result) => {
                  document.body.classList.toggle('loading')
                  if (result.auth_email_yn === 'N') {
                    this.$store.dispatch('LOGOUT').then(() => {
                      this.$router.push('/error/401')
                    })
                  } else {
                    this.$router.push('redirect' in params ? params.redirect : '/')
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
              this.$swal({
                title: '오류!',
                text: '입력하신 정보가 올바르지 않습니다.',
                type: 'error',
                width: '90vw'
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
body:not(.isMobile) {
  & [data-form-center] {
    > header {
      & h2 {
        display: none;
      }
    }
  }
}

body.isMobile {
  & [data-form-center] {
    > header {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      min-height: unset;
      max-height: 3rem;
      padding: 0 .6rem .4rem .6rem;
      > h1 {
        font: {
          size: 1.5rem;
        }
        margin-bottom: unset;
      }
      > h2 {
        font: {
          size: 1rem;
        }
      }
      > small {
        display: none;
      }
    }
  }
}

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
