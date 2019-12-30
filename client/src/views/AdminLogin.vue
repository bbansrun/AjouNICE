<template>
    <div class="wrapper" data-form-wrapper>
        <flash-message></flash-message>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form method="POST" action='/api/auth/login'>
                <header class="logo-font"><span>ADMIN<small text-divider-block>관리자</small></span></header>
                <div class="divider"></div>
                <div class="input-form-wrapper">
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
                    </div>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'

Vue.use(VueFlashMessage)

export default {
  name: 'admin_login',
  data () {
    return {
      formErrors: [],
      userID: ''
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
