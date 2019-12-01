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
                    <input @blur="checkDupIDNum" v-model="userIDNum" type="text" placeholder="학번" required pattern="[0-9]{9,}">
                    <p v-if="this.userIDNumDuplicated !== 'empty' && !this.userIDNumDuplicated">신규 회원가입이 가능합니다.</p>
                    <p v-else-if="this.userIDNumDuplicated !== 'empty' && this.userIDNumDuplicated">이미 가입된 계정입니다.</p>
                </div>
                <div class="input-form">
                    <select name="memberType" id="memberType" required @change="onUserTypeChange($event)" v-model="this.selectedUserType">
                        <option v-for="option in this.userOptions" :disabled="option.disabled" :value="option.value" :key="option.value">{{ option.name }}</option>
                    </select>
                </div>
                <div class="input-form">
                    <input @blur="checkDupEmail" v-model="email" type="email" placeholder="이메일 (구성원은 @ajou.ac.kr으로만 사용가능)" required>
                    <p v-if="this.emailDuplicated !== 'empty' && !this.emailDuplicated">신규 회원가입이 가능합니다.</p>
                    <p v-else-if="this.emailDuplicated !== 'empty' && this.emailDuplicated">이미 가입된 계정입니다.</p>
                </div>
                <div class="input-form">
                    <input type="text" placeholder="아이디" @blur="checkDupID" required v-model="userID">
                </div>
                <div class="input-form">
                    <input type="password" pattern=".{8,}" placeholder="패스워드" required>
                    <input type="password" pattern=".{8,}" placeholder="패스워드 재확인" required>
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
      email: '',
      userID: '',
      userIDNum: '',
      emailDuplicated: 'empty',
      userIDDuplicated: 'empty',
      userIDNumDuplicated: 'empty',
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
      if (this.email) {
        this.$apollo.query({
          query: gql`
          query {
            findEmail(email: "${this.email}") {
              id
            }
          }
          `
        }).then(result => {
          if (result.data.findEmail.length > 0) {
            this.emailDuplicated = true
          } else {
            this.emailDuplicated = false
          }
        })
      }
    },
    checkDupID () {
      if (this.userID) {
        this.$apollo.query({
          query: gql`
            query {
              findIdNums(identityNum: ${this.userID}) {
                id
              }
            }
          `
        }).then(result => this.userIDDuplicated = false)
      }
    },
    checkDupIDNum () {
      if (this.userIDNum) {
        this.$apollo.query({
          query: gql`{ findIdNums(identityNum: ${this.userIDNum}) { id } }`
        }).then(result => {
          if (result.data.findIdNums.length > 0) {
            this.userIDNumDuplicated = true
          } else {
            this.userIDNumDuplicated = false
          }
        })
      }
    },
    onUserTypeChange (event) {
      if (event.target.value == 5) {
        this.$swal({
          title: '주의!',
          text: '아주대학교 구성원이 아니실 경우 서비스 기능 이용에 제한이 있을 수 있습니다.',
          width: '90vw',
          type: 'warning',
          footer: '<a href="#/">아주나이스 서비스 정책 자세히보기</a>'
        })
      } else {
        this.$swal({
          title: '주의!',
          text: '아주대학교 구성원은 @ajou.ac.kr 이메일을 통한 인증을 통해 차후 정상적인 서비스 이용이 가능합니다.',
          width: '90vw',
          type: 'warning',
          footer: '<a href="#/">아주나이스 서비스 정책 자세히보기</a>'
        })
      }
    },
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
