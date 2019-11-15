<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font"><small>Welcome, </small><br />AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티,<br />아주나이스에 오신 것을 환영합니다.</small>
            </header>
            <form method="GET" action='/#/home'>
                <header class="logo-font">SIGN UP</header>
                <div class="divider"></div>
                <div class="input-form">
                    <input type="text" placeholder="이름" required>
                </div>
                <div class="input-form">
                    <input type="text" placeholder="학번" required pattern="[0-9]{9,}">
                </div>
                <div class="input-form">
                    <select name="memberType" id="memberType" required v-model="this.selectedUserType">
                        <option v-for="option in this.userOptions" :disabled="option.disabled" :value="option.value" :key="option.value">{{ option.name }}</option>
                    </select>
                </div>
                <div class="input-form">
                    <input type="email" placeholder="이메일" required>
                </div>
                <div class="input-form">
                    <input type="password" placeholder="패스워드" required>
                    <input type="password" placeholder="패스워드 재확인" required>
                </div>
                <div class="input-form">
                    <label for="policy">아주나이스의 서비스 정책 및 개인정보 수집 이용에 동의합니다.</label>
                    <input type="checkbox" name="policy" id="policy" v-model="agreePolicy" />
                </div>
                <div class="input-form">
                    <input type="button" @click="signup" value="회원가입">
                </div>
                <div class="input-form">
                    <router-link to="/">로그인 화면으로</router-link>
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
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
Vue.use(VueSweetalert2)
export default {
  name: 'signup',
  data () {
    return {
      agreePolicy: false,
      selectedUserType: null,
      userOptions: [
        { disabled: true, value: null, name: '구성원 여부를 선택하여주세요' },
        { disabled: false, value: 1, name: '학부생' },
        { disabled: false, value: 2, name: '대학원' },
        { disabled: false, value: 3, name: '교직원' },
        { disabled: false, value: 4, name: '졸업생' },
        { disabled: false, value: 5, name: '일반' }
      ]
    }
  },
  methods: {
    signup () {
      if (!this.agreePolicy) {
        this.$swal({
          title: '잠깐!',
          text: '서비스 정책 및 개인정보 수집 이용에 동의하셔야 회원가입이 가능합니다.',
          type: 'error',
          width: '90vw',
          animation: true
        })
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
@import '~sweetalert2/src/variables';
@import '~sweetalert2/src/sweetalert2';
.swal2-container.swal2-center {
    background: rgba(0,0,0,.65);
}
</style>
