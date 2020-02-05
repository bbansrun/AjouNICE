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
              type="email"
              placeholder="이메일"
              :value="email"
              disabled
            >
          </div>
          <div class="input-form">
            <div
              v-if="mode.modify"
              class="input-group"
            >
              <input
                v-model="pre_password"
                name="password"
                autofocus
                type="password"
                autocapitalize="none"
                pattern=".{8,}"
                placeholder="기존 패스워드"
                required
                :class="{ 'error': errorValidation.pre_user_pw }"
              >
              <p
                v-if="errorValidation.pre_user_pw"
                class="auto-validate-noti"
                :class="{ 'error': errorValidation.pre_user_pw }"
              >
                {{ errorMsg.pre_user_pw }}
              </p>
            </div>
            <div class="input-group">
              <input
                v-model="password"
                name="password"
                autofocus
                type="password"
                autocapitalize="none"
                pattern=".{8,}"
                placeholder="신규 패스워드"
                required
                :class="{ 'error': errorValidation.user_pw }"
              >
              <p
                v-if="errorValidation.user_pw"
                class="auto-validate-noti"
                :class="{ 'error': errorValidation.user_pw }"
              >
                {{ errorMsg.user_pw }}
              </p>
            </div>
            <div class="input-group">
              <input
                v-model="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autocapitalize="none"
                pattern=".{8,}"
                placeholder="패스워드 재확인"
                required
                :class="{ 'error': errorValidation.user_pw_confirm }"
              >
              <p
                v-if="passwordConfirm && validatedPWConfirm && !errorValidation.user_pw_confirm"
                class="auto-validate-noti"
              >
                패스워드 확인이 일치합니다.
              </p>
              <p
                v-if="errorValidation.user_pw_confirm"
                class="auto-validate-noti"
                :class="{ 'error': errorValidation.user_pw_confirm }"
              >
                {{ errorMsg.user_pw_confirm }}
              </p>
            </div>
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
import pathParser from 'path-parse'
import gql from 'graphql-tag'
export default {
  data () {
    return {
      email: '',
      pre_password: '',
      password: '',
      passwordConfirm: '',
      validatedPWConfirm: false,
      errorValidation: {
        pre_user_pw: false,
        user_pw: false,
        user_pw_confirm: false
      },
      errorMsg: {
        pre_user_pw: '',
        user_pw: '',
        user_pw_confirm: ''
      },
      mode: {
        reset: false,
        modify: false
      }
    }
  },
  watch: {
    password (value) {
      if (value) {
        if (value.length >= 8) {
          this.initError('user_pw')
        } else {
          this.occurError('user_pw', '패스워드는 8자 이상으로 입력해주세요.')
        }
      } else {
        this.initError('user_pw')
      }
      if (this.passwordConfirm) {
        if (value === this.passwordConfirm) {
          this.validatedPWConfirm = true
          this.initError('user_pw_confirm')
        } else {
          this.occurError('user_pw_confirm', '패스워드 확인이 일치하지 않습니다.')
        }
      } else {
        this.initError('user_pw_confirm')
      }
    },
    passwordConfirm (value) {
      if (value) {
        if (value === this.password) {
          this.validatedPWConfirm = true
          this.initError('user_pw_confirm')
        } else {
          this.occurError('user_pw_confirm', '패스워드 확인이 일치하지 않습니다.')
        }
      } else {
        this.initError('user_pw_confirm')
      }
    }
  },
  beforeCreate () {
    document.body.classList.add('auth')
  },
  beforeMount () {
    this.authorizeToken()
  },
  methods: {
    initError (key) {
      this.errorValidation[key] = false
      this.errorMsg[key] = ''
    },
    occurError (key, msg) {
      this.errorValidation[key] = true
      this.errorMsg[key] = msg
    },
    authorizeToken () {
      const _this = this
      const pParser = pathParser(this.$route.path)
      this.mode.reset = (pParser.dir === '/auth/reset' && pParser.name === 'authorize')
      this.mode.modify = (pParser.dir.split('/')[1] === 'profile' && pParser.name === 'edit')
      if (this.mode.reset || this.mode.modify) {
        if (this.mode.reset && 'authToken' in this.$route.query) {
          this.$apollo.query({
            query: gql`{ findUserByToken(token: "${_this.$route.query.authToken}") { user_idx email } }`
          }).then(result => {
            this.email = result.data.findUserByToken.email
          }).catch(error => {
            console.error(error)
            window.location = '/error/500'
          })
        } else if (this.mode.modify) {
          this.email = this.$store.state.user.email
        } else {
          window.location = '/error/404'
        }
      }
    },
    resetAccount () {
      if (!this.password) {
        this.occurError('user_pw', '항목이 비어있습니다.')
      }
      if (!this.passwordConfirm) {
        this.occurError('user_pw_confirm', '항목이 비어있습니다.')
      }
      if (Object.values(this.errorValidation).filter(item => item === true).length > 0) {
        this.$swal({
          title: '잠깐!',
          text: '누락된 데이터가 있거나 입력된 항목의 내용이 올바른 형식이 아닙니다.',
          type: 'error',
          width: '90vw',
          footer: '<span>해당 항목을 확인 후 다시 시도하여주시기 바랍니다.<br />지속적으로 문제가 발생할 경우 관리자에게 문의하여주세요.</span>'
        })
      } else {
        // 비밀번호 재설정 진행
        const data = {
          authToken: this.$route.query.authToken,
          password: this.password,
          passwordConfirm: this.passwordConfirm
        }
        if (this.mode.reset) {
          data.mode = 'reset'
        } else if (this.mode.modify) {
          data.mode = 'modify'
          data.prePassword = this.pre_password
        }
        this.$Axios({
          method: 'POST',
          url: '/api/auth/update',
          data: data
        }).then(result => {
          if (result.status === 201) {
            this.$swal({
              title: '패스워드 변경 완료',
              text: '패스워드가 변경되었습니다.',
              type: 'success',
              width: '90vw',
              footer: '<p>입력하신 새로운 비밀번호로 로그인하시면 서비스 이용이 가능합니다.</p>'
            }).then(() => {
              window.location = '/'
            })
          } else {
            throw Error(result)
          }
        }).catch(error => {
          this.$swal('실패!', error, 'error')
          console.error(error)
        })
      }
    }
  }
}
</script>
