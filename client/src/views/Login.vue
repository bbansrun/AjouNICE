<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form @submit="checkValidation" method="GET" action='/#/home'>
                <header class="logo-font">LOGIN</header>
                <div class="divider"></div>
                <div class="input-form">
                    <input type="text" placeholder="아이디" v-model="userID" required>
                </div>
                <div class="input-form">
                    <input type="password" placeholder="패스워드" required>
                </div>
                <div class="input-form">
                    <input type="submit" value="로그인">
                </div>
                <div class="input-form">
                    <router-link to="/auth/reset">계정 재설정</router-link>
                    <router-link to="/auth/signup">아직 회원이 아니신가요?</router-link>
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
  name: 'login',
  data () {
    return {
      formErrors: [],
      userID: ''
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
