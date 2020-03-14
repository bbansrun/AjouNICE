<template>
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
            required
            :class="{ 'error': emailError }"
            @keyup.enter="resetAccount"
          >
          <p
            v-if="emailError"
            class="auto-validate-noti"
            :class="{ 'error': emailError }"
          >
            {{ emailErrorMsg }}
          </p>
        </div>
        <div class="input-form-group buttons">
          <b-button
            class="is-medium submit"
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
</template>

<script>
import gql from 'graphql-tag'
import { DupEmailCheck } from '@/assets/graphql/queries'

export default {
  name: 'Reset',
  data () {
    return {
      email: '',
      emailError: false,
      emailErrorMsg: ''
    }
  },
  watch: {
    email (value) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
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
  beforeCreate () {
    document.body.classList.add('auth')
  },
  methods: {
    initError () {
      this.emailError = false
      this.emailErrorMsg = ''
    },
    resetAccount () {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.email) {
        if (re.test(this.email)) {
          this.$apollo.query({
            query: gql`${DupEmailCheck}`,
            variables: {
              email: this.email
            }
          }).then(({ data: { doesEmailExists } }) => {
            if (doesEmailExists) {
              this.$apollo.mutate({
                mutation: gql`mutation { resetEmailToken(email: "${this.email}") }`
              }).then(({ data: { resetEmailToken } }) => {
                if (resetEmailToken) {
                  this.$swal({
                    type: 'success',
                    width: '90vw',
                    title: '재설정 이메일 발송',
                    text: '패스워드 재설정 이메일을 입력하신 주소로 발송하였습니다. 수신함을 확인해주세요.',
                    footer: '<p>스팸으로 분류되는 경우도 발생할 수 있으니 수신되지 않은 경우 해당 문서함을 확인해주세요.</p>'
                  }).then(result => {
                    this.$router.push('/')
                  })
                }
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
