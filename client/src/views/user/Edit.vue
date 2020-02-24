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
            <h2>Recovery</h2>
            <small>계정 재설정</small>
          </header>
          <div class="input-form">
            <div class="input-form-wrapper">
              <div class="input-form-group">
                <input
                  v-model="email"
                  type="email"
                  placeholder="이메일"
                  disabled
                >
              </div>
              <div class="input-form-group">
                <div class="input-group">
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
              <div class="input-form-group buttons">
                <b-button
                  class="submit"
                  size="is-medium"
                  type="is-dark"
                  expanded
                  @click="resetAccount"
                >
                  <font-awesome-icon icon="users-cog" />&nbsp;
                  <span>계정 재설정</span>
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
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import Logo from '@/assets/images/AjouNICE_shadow.svg'
export default {
  components: {
    Logo
  },
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
  mounted () {
    this.email = this.$store.state.user.email
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
          footer: '<span>해당 항목을 확인 후 다시 시도하여주시기 바랍니다.<br />지속적으로 문제가 발생할 경우 관리자에게 문의하여주세요.</span>'
        })
      } else {
        // 비밀번호 재설정 진행
        const data = {
          mode: 'modify',
          authToken: this.$route.query.authToken,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
          prePassword: this.pre_password
        }
        this.$Axios({
          method: 'POST',
          url: '/api/auth/update',
          data
        }).then(result => {
          if (result.status === 201) {
            this.$swal({
              title: '패스워드 변경 완료',
              text: '패스워드가 변경되었습니다.',
              type: 'success',
              footer: '<p>입력하신 새로운 비밀번호로 로그인하시면 서비스 이용이 가능합니다.</p>'
            }).then(() => {
              this.$store.dispatch('LOGOUT').then(() => {
                this.$router.push('/')
              })
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
