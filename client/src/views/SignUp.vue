<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font"><small>Welcome, </small><br />AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티,<br />아주나이스에 오신 것을 환영합니다.</small>
            </header>
            <form method="GET" action='/#/home'>
                <header class="logo-font">SIGN UP</header>
                <div class="input-form">
                    <select name="memberType" id="memberType" required @change="onUserTypeChange($event)" v-model="this.selectedUserType">
                        <option v-for="option in this.userOptions" :disabled="option.disabled" :value="option.value" :key="option.value">{{ option.name }}</option>
                    </select>
                </div>
                <div class="input-form">
                    <input type="text" placeholder="이름" required>
                </div>
                <div class="input-form">
                    <input name="IDNum" @keyup="checkDupIDNum" @blur="checkDupIDNum" :disabled="this.condUserTypeNormal" :class="{ 'error': this.userIDNumDuplicated.checked && this.userIDNumDuplicated.duplicated }" v-model="userIDNum" type="text" placeholder="학번" required pattern="[0-9]{9,}">
                    <p class="auto-validate-noti" v-if="this.userIDNumDuplicated.checked && !this.userIDNumDuplicated.duplicated">신규 회원가입이 가능합니다.</p>
                    <p class="auto-validate-noti" :class="{ 'error': this.userIDNumDuplicated.checked && this.userIDNumDuplicated.duplicated }" v-else-if="this.userIDNumDuplicated.checked && this.userIDNumDuplicated.duplicated">이미 가입된 계정입니다. <router-link to="/">로그인</router-link></p>
                </div>
                <div class="input-form">
                    <input name="email" @keyup="checkDupEmail" @blur="checkDupEmail" :class="{ 'error': this.emailDuplicated.checked && this.emailDuplicated.duplicated }" v-model="email" type="email" placeholder="이메일 (구성원은 @ajou.ac.kr으로만 사용가능)" required>
                    <p class="auto-validate-noti" v-if="this.emailDuplicated.checked && !this.emailDuplicated.duplicated">사용 가능한 이메일입니다.</p>
                    <p class="auto-validate-noti" :class="{ 'error': this.emailDuplicated.checked && this.emailDuplicated.duplicated }" v-else-if="this.emailDuplicated.checked && this.emailDuplicated.duplicated">이미 가입된 계정입니다. <router-link to="/auth/reset">패스워드가 생각나지 않는다면?</router-link></p>
                </div>
                <div class="input-form">
                    <input name="userID" @keyup="checkDupID" @blur="checkDupID" type="text" placeholder="아이디" :class="{ 'error': this.userIDDuplicated.checked && this.userIDDuplicated.duplicated }" required v-model="userID">
                    <p class="auto-validate-noti" v-if="this.userIDDuplicated.checked && !this.userIDDuplicated.duplicated">사용 가능한 아이디입니다.</p>
                    <p class="auto-validate-noti" :class="{ 'error': this.userIDDuplicated.checked && this.userIDDuplicated.duplicated }" v-else-if="this.userIDDuplicated.checked && this.userIDDuplicated.duplicated">이미 가입된 계정입니다.</p>
                </div>
                <div class="input-form">
                    <input name="password" @blur="checkConfirmCorrect" @keypress="checkConfirmCorrect" v-model="password" type="password" pattern=".{8,}" placeholder="패스워드" required>
                    <input name="passwordConfirm" @blur="checkConfirmCorrect" @keypress="checkConfirmCorrect" v-model="passwordConfirm" type="password" pattern=".{8,}" placeholder="패스워드 재확인" required :class="{ 'error': this.isPWConfirmMatches.typed && !(this.isPWConfirmMatches.matches) }">
                    <p class="auto-validate-noti" :class="{ 'error': this.isPWConfirmMatches.typed && !(this.isPWConfirmMatches.matches) }" v-if="isPWConfirmMatches.typed && !(isPWConfirmMatches.matches)">패스워드 재확인이 일치하지 않습니다.</p>
                    <p class="auto-validate-noti" v-else-if="isPWConfirmMatches.typed && (isPWConfirmMatches.matches)">패스워드 재확인이 일치합니다.</p>
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
import gql from 'graphql-tag'

Vue.use(VueSweetalert2)

export default {
  name: 'signup',
  data () {
    return {
      signupAvailable: false,
      email: '',
      password: '',
      passwordConfirm: '',
      isPWConfirmMatches: {
        typed: false,
        matches: false
      },
      userID: '',
      userIDNum: '',
      emailDuplicated: {
        checked: false,
        duplicated: false,
        message: ''
      },
      userIDDuplicated: {
        checked: false,
        duplicated: false,
        message: ''
      },
      userIDNumDuplicated: {
        checked: false,
        duplicated: false,
        message: ''
      },
      condUserTypeNormal: false,
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
    checkDupEmail () {
      let re = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (this.email && re.test(String(this.email).toLowerCase()) && (this.selectedUserType && (this.selectedUserType !== 5 && this.email.includes('ajou.ac.kr')))) {
        this.$apollo.query({
          query: gql`{ findEmail(email: "${this.email}") { email } }`
        }).then(result => {
          this.emailDuplicated.checked = true
          if (result.data.findEmail.length > 0) {
            this.emailDuplicated.duplicated = true
          } else {
            this.emailDuplicated.duplicated = false
          }
        })
      }
    },
    checkDupID () {
      if (this.userID) {
        this.$apollo.query({
          query: gql`{ findUserID(userId: "${this.userID}") { user_id } }`
        }).then(result => {
          this.userIDDuplicated.checked = true
          if (result.data.findUserID.length > 0) {
            this.userIDDuplicated.duplicated = true
          } else {
            this.userIDDuplicated.duplicated = false
          }
        })
      }
    },
    checkDupIDNum () {
      if (this.userIDNum && this.userIDNum.length === 9) {
        this.$apollo.query({
          query: gql`{ findIdNums(identityNum: ${this.userIDNum}) { identity_num } }`
        }).then(result => {
          this.userIDNumDuplicated.checked = true
          if (result.data.findIdNums.length > 0) {
            this.userIDNumDuplicated.duplicated = true
          } else {
            this.userIDNumDuplicated.duplicated = false
          }
        })
      }
    },
    checkConfirmCorrect () {
      if (this.password.length > 0 && this.passwordConfirm.length > 0) {
        this.isPWConfirmMatches.typed = true
        if (this.passwordConfirm !== this.password) {
          this.isPWConfirmMatches.matches = false
        } else if (this.passwordConfirm === this.password) {
          this.isPWConfirmMatches.matches = true
        }
      }
    },
    onUserTypeChange (event) {
      if (event.target.value === 5) {
        this.$swal({
          title: '주의!',
          text: '아주대학교 구성원이 아니실 경우 서비스 기능 이용에 제한이 있을 수 있습니다.',
          width: '90vw',
          type: 'warning',
          footer: '<a href="#/">아주나이스 서비스 정책 자세히보기</a>'
        })
        this.condUserTypeNormal = true
      } else {
        this.$swal({
          title: '주의!',
          text: '아주대학교 구성원은 @ajou.ac.kr 이메일을 통한 인증을 통해 차후 정상적인 서비스 이용이 가능합니다.',
          width: '90vw',
          type: 'warning',
          footer: '<a href="#/">아주나이스 서비스 정책 자세히보기</a>'
        })
        this.condUserTypeNormal = false
      }
    },
    signup () {
      if (!this.signupAvailable) {
        this.$swal('잠깐!', '회원가입에 필요한 데이터가 입력되지 않았습니다.', 'error')
      }
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
