<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font"><small>Welcome, </small><br />AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티,<br />아주나이스에 오신 것을 환영합니다.</small>
            </header>
            <form method="GET" action='/#/home'>
                <header class="logo-font"><span>SIGN UP<small text-divider-block>회원가입</small></span></header>
                <div class="input-form-wrapper">
                  <div class="input-form">
                    <v-select placeholder="구성원 여부를 선택해주세요." v-model="this.selectedUserType" :value="this.selectedUserType" @input="selectedUser" :options="this.userOptions" :reduce="options => options.code" label="label"></v-select>
                    <div class="notice">
                      <span v-show="this.selectedUserType === 5">아주 구성원 외의 서비스 이용자는 서비스의 일부 기능이 제한됩니다.</span>
                      <span v-show="this.selectedUserType !== 5">아주 구성원의 경우 인증을 위해 ajou.ac.kr 이메일을 사용하여주시기 바랍니다.</span>
                    </div>
                  </div>
                  <div class="input-form" v-if="this.selectedUserType === 1">
                    <v-select placeholder="소속대학을 선택하여주세요." v-model="this.selectedCollege" :value="this.selectedCollege" @input="selectedCollegeCd" :options="this.collegeList" :reduce="college => college.college_cd" label="college_nm"></v-select>
                    <v-select v-if="this.selectedCollege !== undefined" placeholder="소속학과를 선택하여주세요." v-model="this.selectedDpt" :value="this.selectedDpt" @input="selectedDptCd" :options="this.dptList" :reduce="dpt => dpt.dpt_cd" label="dpt_nm"></v-select>
                  </div>
                  <div class="input-form">
                      <input type="text" v-model="userName" placeholder="이름" required>
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
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import vSelect from 'vue-select'
import VueSweetalert2 from 'vue-sweetalert2'
import VueFlashMessage from 'vue-flash-message'
import gql from 'graphql-tag'

Vue.component('v-select', vSelect)
Vue.use(VueSweetalert2)
Vue.use(VueFlashMessage)

export default {
  name: 'signup',
  data () {
    return {
      signupAvailable: false,
      email: '',
      password: '',
      passwordConfirm: '',
      userName: '',
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
      selectedUserType: 5,
      userOptions: [
        { code: 1, label: '학부생' },
        { code: 2, label: '대학원' },
        { code: 3, label: '교직원' },
        { code: 4, label: '졸업생' },
        { code: 5, label: '일반' }
      ],
      collegeList: [],
      dptList: [],
      selectedCollege: '',
      selectedDpt: ''
    }
  },
  created () {
    this.$apollo.query({
      query: gql`{ findColleges(exist_yn: "Y") { college_cd college_nm } }`
    }).then(result => {
      this.collegeList = result['data']['findColleges']
    })
  },
  watch: {
    selectedCollege (value) {
      this.$apollo.query({
        query: gql`{ findDptByCollege(college_cd: "${value}") { dpt_nm dpt_cd college_cd } }`
      }).then(result => {
        this.dptList = result['data']['findDptByCollege']
      })
    }
  },
  methods: {
    selectedUser (value) {
      this.selectedUserType = value
    },
    selectedCollegeCd (value) {
      this.selectedCollege = value
    },
    checkDupEmail () {
      let query = (email) => {
        this.$apollo.query({
          query: gql`{ findEmail(email: "${email}") { email } }`
        }).then(result => {
          this.emailDuplicated.checked = true
          if (result.data.findEmail.length > 0) {
            this.emailDuplicated.duplicated = true
          } else {
            this.emailDuplicated.duplicated = false
          }
        })
      }
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.selectedUserType === 5) {
        if (this.email && re.test(String(this.email).toLowerCase())) {
          query(this.email)
        }
      } else {
        if (this.email && re.test(String(this.email).toLowerCase()) && this.email.includes('ajou.ac.kr')) {
          query(this.email)
        }
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
    async signup () {
      if (!this.agreePolicy) {
        this.$swal({
          title: '잠깐!',
          text: '서비스 정책 및 개인정보 수집 이용에 동의하셔야 회원가입이 가능합니다.',
          type: 'error',
          width: '90vw',
          animation: true
        })
      }
      if (this.signupAvailable) {
        this.$swal('잠깐!', '회원가입에 필요한 데이터가 입력되지 않았습니다.', 'error')
      } else {
        axios.get('/api/reqClientIP').then(client => {
          this.$apollo.mutate({
            mutation: gql`mutation { register(email: "${this.email}", user_id: "${this.userID}", password: "${this.password}", user_nm: "${this.userName}", identity_num: ${this.userIDNum}, user_type: "${this.selectedUserType}", sex_gb: "", college_cd: "", dpt_cd: "", nick_nm: "", reg_ip: "${client.data.result.ip}") { user_idx } }`
          }).then(result => {
            if (typeof result === 'object') {
              if ('data' in result) {
                this.flash('회원가입 성공! 로그인 후 서비스 이용이 가능합니다.', 'success')
                this.$swal({
                  title: '축하합니다!',
                  text: '이제 아주나이스의 서비스를 이용하실 수 있습니다. 로그인 후 사용가능합니다.',
                  type: 'success',
                  width: '90vw',
                  animation: true
                }).then(result => {
                  window.location = '/'
                })
              }
            }
          }).catch(error => {
            if (error.message === 'GraphQL error: Validation error') {
              this.$swal({
                title: '실패하였습니다!',
                text: '이미 입력하신 내용으로 가입된 계정이 존재합니다. 항목을 다시 확인하여주세요.',
                width: '90vw',
                type: 'error',
                animation: true,
                footer: '<a>가입에 문제가 있다면? 관리자에게 해당 내용을 문의하여주세요.</a>'
              })
            }
          })
        })
      }
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
@import '~sweetalert2/src/variables';
@import '~sweetalert2/src/sweetalert2';
@import '~vue-select/src/scss/vue-select';
.swal2-container.swal2-center {
    background: rgba(0,0,0,.65);
}
.v-select {
  margin: 0 calc(5% + 10px);
  background: #fff;
  box-shadow: 0 2px 2px rgba(36, 37, 38, 0.08);
  +.notice {
    font-size: 14px;
  }
  > .vs__dropdown-toggle + [role="listbox"] > li {
    transition: .2s all ease;
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  }
  > .vs__dropdown-toggle + [role="listbox"] > .vs__dropdown-option--highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
