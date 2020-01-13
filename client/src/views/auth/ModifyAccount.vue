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
                      <input type="email" placeholder="이메일" :value="email" disabled>
                  </div>
                  <div class="input-form">
                    <div class="input-group">
                      <input name="password" autofocus v-model="password" type="password" autocapitalize="none" pattern=".{8,}" placeholder="패스워드" required :class="{ 'error': this.errorValidation.user_pw }">
                      <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_pw }" v-if="this.errorValidation.user_pw">{{ this.errorMsg.user_pw }}</p>
                    </div>
                    <div class="input-group">
                      <input name="passwordConfirm" v-model="passwordConfirm" type="password" autocapitalize="none" pattern=".{8,}" placeholder="패스워드 재확인" required :class="{ 'error': this.errorValidation.user_pw_confirm }">
                      <p class="auto-validate-noti" v-if="this.passwordConfirm && this.validatedPWConfirm && !this.errorValidation.user_pw_confirm">패스워드 확인이 일치합니다.</p>
                      <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_pw_confirm }" v-if="this.errorValidation.user_pw_confirm">{{ this.errorMsg.user_pw_confirm }}</p>
                    </div>
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
    data () {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            validatedPWConfirm: false,
            errorValidation: {
                user_pw: false,
                user_pw_confirm: false
            },
            errorMsg: {
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
        },
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
            let params = this.$route.query
            if ('authToken' in params) {
                this.$apollo.query({
                    query: gql`{ findUserByToken(token: "${params['authToken']}") { user_idx email } }`
                }).then(result => {
                    this.email = result.data.findUserByToken.email
                }).catch(error => {
                    console.error(error)
                    window.location = '/error/500'
                })
            } else {
                window.location = '/error/404'
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
            }
        }
    },
    beforeCreate () {
        document.body.classList.add('auth')
    },
    beforeMount () {
        this.authorizeToken()
    }
}
</script>