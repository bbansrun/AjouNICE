<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form @submit="checkValidation" method="GET" action='/#/home'>
                <header class="logo-font">Reset Account</header>
                <div class="divider"></div>
                <div class="input-form">
                    <input type="email" placeholder="이메일" v-model="email" required>
                </div>
                <div class="input-form">
                    <input type="submit" value="계정 재설정">
                </div>
                <div class="divider"></div>
                <footer>
                    <span>&copy; 2019 팀 <a href="http://github.com/bbansrun">빤스런</a>.</span>
                </footer>
                <hr>
                <img src="@/assets/images/slogan_01.png" alt="CONNECTING MINDS @ AJOU" width="350" />
            </form>
        </section>
    </div>
</template>

<script>
export default {
  name: 'reset',
  data () {
      return {
          formErrors: [],
          email: ''
      }
  },
  methods: {
      checkValidation (e) {
          let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (!re.test(String(this.email).toLowerCase())) {
              this.formErrors.push('이메일 형식이 잘못되었습니다.')
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
@import "~@/assets/styles/auth";
</style>