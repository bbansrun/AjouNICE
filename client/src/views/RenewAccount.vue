<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form method="POST">
                <header class="logo-font">Reset Account</header>
                <div class="divider"></div>
                <div class="input-form-wrapper">
                  <div class="input-form">
                      <input type="email" @keyup.delete="initError()" placeholder="이메일" v-model="email" required :class="{ 'error': this.emailError }">
                      <p class="auto-validate-noti" :class="{ 'error': this.emailError }" v-if="this.emailError">{{ this.emailErrorMsg }}</p>
                  </div>
                  <div class="input-form">
                      <input type="submit" value="계정 재설정">
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
export default {
  name: 'reset',
  data () {
    return {
      email: '',
      emailError: false,
      emailErrorMsg: ''
    }
  },
  watch: {
    email (value) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (!re.test(String(this.email).toLowerCase())) {
        this.emailError = true
        this.emailErrorMsg = '이메일 형식이 잘못되었습니다.'
      } else {
        this.initError()
      }
    }
  },
  methods: {
    initError () {
      this.emailError = false
      this.emailErrorMsg = ''
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
