<template>
    <div class="wrapper" data-form-wrapper>
        <section data-form class="form login">
            <header>
                <h1 class="logo-font"><small>Welcome, </small><br />AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티,<br />아주나이스에 오신 것을 환영합니다.</small>
            </header>
            <form method="GET" action='/#/home' autocomplete="off">
                <header class="logo-font"><span>SIGN UP<small text-divider-block>회원가입</small></span></header>
                <div class="input-form-wrapper">
                  <div class="input-form">
                    <v-select placeholder="구성원 여부를 선택해주세요." v-model="this.selectedUserType" :value="this.selectedUserType" @input="selectedUser" :options="this.userOptions" :reduce="options => options.code" label="label"></v-select>
                    <div class="notice">
                      <span v-show="this.selectedUserType === 5"><strong>아주 구성원 외의 서비스 이용자는 서비스의 일부 기능이 제한됩니다.</strong></span>
                      <span v-show="this.selectedUserType !== 5"><strong>아주 구성원의 경우 인증을 위해 ajou.ac.kr 이메일을 사용하여주시기 바랍니다.</strong></span>
                    </div>
                  </div>
                  <div class="input-form" v-if="this.selectedUserType === 1">
                    <v-select placeholder="소속대학을 선택하여주세요." v-model="this.selectedCollege" :value="this.selectedCollege" @input="selectedCollegeCd" :options="this.collegeList" :reduce="college => college.college_cd" label="college_nm"></v-select>
                    <v-select v-if="this.selectedCollege !== ''" placeholder="소속학과를 선택하여주세요." v-model="this.selectedDpt" :value="this.selectedDpt" @input="selectedDptCd" :options="this.dptList" :reduce="dpt => dpt.dpt_cd" label="dpt_nm"></v-select>
                    <div class="input-form-sub" v-if="this.selectedCollege !== '' && this.selectedDpt !== ''">
                      <label for="smajor">복수전공 혹은 부전공을 이수하고 있습니다.</label>
                      <input type="checkbox" name="smajor" id="smajor" v-model="hasSubMajor" />
                      <v-select v-if="this.hasSubMajor" placeholder="소속대학을 선택하여주세요." v-model="this.selectedSubCollege" :value="this.selectedSubCollege" @input="selectedSubCollegeCd" :options="this.collegeList" :reduce="college => college.college_cd" label="college_nm"></v-select>
                      <v-select v-if="this.hasSubMajor && this.selectedSubCollege !== ''" placeholder="소속학과를 선택하여주세요." v-model="this.selectedSubDpt" :value="this.selectedSubDpt" @input="selectedSubDptCd" :options="this.dptSubList" :reduce="dpt => dpt.dpt_cd" label="dpt_nm"></v-select>
                    </div>
                  </div>
                  <div class="input-form">
                      <input type="text" v-model="userName" placeholder="이름" required>
                  </div>
                  <div class="input-form">
                      <input name="IDNum" :disabled="this.condUserTypeNormal" v-model="userIDNum" type="text" placeholder="학번" required pattern="[0-9]{9,}">
                  </div>
                  <div class="input-form">
                      <input name="email" @keyup.delete="checkDupEmail" @blur="checkDupEmail" :class="{ 'error': this.email && ((this.emailValidation.checked && this.emailValidation.duplicated) || this.emailValidation.checkedNormalButMember) }" v-model="email" type="email" placeholder="이메일 (구성원은 @ajou.ac.kr으로만 사용가능)" required>
                      <p class="auto-validate-noti" v-if="this.email && this.emailValidation.checked && !this.emailValidation.duplicated">사용 가능한 이메일입니다.</p>
                      <p class="auto-validate-noti" :class="{ 'error': this.email && this.emailValidation.checked && this.emailValidation.duplicated }" v-else-if="this.email && this.emailValidation.checked && this.emailValidation.duplicated">이미 가입된 계정입니다. <router-link to="/auth/reset">패스워드가 생각나지 않는다면?</router-link></p>
                      <p class="auto-validate-noti" :class="{ 'error': this.email && this.emailValidation.checkedNormalButMember }" v-if="this.email && this.emailValidation.checkedNormalButMember">ajou.ac.kr 이메일 사용자는 아주 구성원(학부생/대학원생/졸업생/교직원) 자격으로 가입이 가능합니다.</p>
                  </div>
                  <div class="input-form">
                      <input name="userID" @keyup.delete="checkDupID" @blur="checkDupID" type="text" placeholder="아이디" :class="{ 'error': this.userID && this.userIDValidation.checked && this.userIDValidation.duplicated }" required v-model="userID">
                      <p class="auto-validate-noti" v-if="this.userID && this.userIDValidation.checked && !this.userIDValidation.duplicated">사용 가능한 아이디입니다.</p>
                      <p class="auto-validate-noti" :class="{ 'error': this.userID && this.userIDValidation.checked && this.userIDValidation.duplicated }" v-else-if="this.userID && this.userIDValidation.checked && this.userIDValidation.duplicated">이미 가입된 계정입니다. <router-link to="/auth/reset">패스워드가 생각나지 않는다면?</router-link></p>
                  </div>
                  <div class="input-form">
                      <input name="password" @blur="checkConfirmCorrect" @keypress="checkConfirmCorrect" v-model="password" type="password" pattern=".{8,}" placeholder="패스워드" required>
                      <input name="passwordConfirm" @blur="checkConfirmCorrect" @keypress="checkConfirmCorrect" v-model="passwordConfirm" type="password" pattern=".{8,}" placeholder="패스워드 재확인" required :class="{ 'error': this.isPWConfirmMatches.typed && !(this.isPWConfirmMatches.matches) }">
                      <p class="auto-validate-noti" :class="{ 'error': this.isPWConfirmMatches.typed && !(this.isPWConfirmMatches.matches) }" v-if="isPWConfirmMatches.typed && !(isPWConfirmMatches.matches)">패스워드 재확인이 일치하지 않습니다.</p>
                      <p class="auto-validate-noti" v-else-if="isPWConfirmMatches.typed && (isPWConfirmMatches.matches)">패스워드 재확인이 일치합니다.</p>
                  </div>
                  <div class="input-form">
                    <span>성별 선택</span>
                    <div class="input-form radio-wrapper">
                      <input type="radio" name="gender" id="genderM" value="M" v-model="gender" required />
                      <label for="genderM">남</label>
                      <input type="radio" name="gender" id="genderW" value="W" v-model="gender" />
                      <label for="genderW">여</label>
                    </div>
                  </div>
                  <div class="input-form">
                    <input type="text" name="nick_nm" id="nickNm" v-model="nick_nm" @blur="checkDupNickName" :class="{ 'error': this.nick_nm && this.isNickNameDuplicated }" placeholder="서비스에서 사용하실 별명을 입력하여주세요." required />
                    <p class="auto-validate-noti" v-if="this.nick_nm && !this.isNickNameDuplicated">사용 가능한 별명입니다.</p>
                    <p class="auto-validate-noti" :class="{ 'error': isNickNameDuplicated }" v-else-if="this.nick_nm && this.isNickNameDuplicated">중복된 별명입니다. 다른 별명을 사용하여주세요.</p>
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
      emailValidation: {
        checked: false,
        duplicated: false,
        checkedNormalButMember: false
      },
      userIDValidation: {
        checked: false,
        duplicated: false
      },
      userIDNumValidation: {
        checked: false,
        duplicated: false
      },
      condUserTypeNormal: false,
      agreePolicy: false,
      userTypes: ['R', 'R', 'E', 'G', 'U', 'A'],
      selectedUserType: 5,
      userOptions: [
        { code: 'R', label: '학부생' },
        { code: 'R', label: '대학원' },
        { code: 'E', label: '교직원' },
        { code: 'G', label: '졸업생' },
        { code: 'U', label: '일반' }
      ],
      collegeList: [],
      dptList: [],
      dptSubList: [],
      selectedCollege: '',
      selectedDpt: '',
      hasSubMajor: '',
      selectedSubCollege: '',
      selectedSubDpt: '',
      gender: '',
      nick_nm: '',
      isNickNameDuplicated: false
    }
  },
  watch: {
    hasSubMajor (value) {
      if (!value) {
        this.selectedSubCollege = ''
        this.selectedSubDpt = ''
      }
    },
    selectedUserType (value) {
      if (value === 1) {
        this.$apollo.query({
          query: gql`{ findColleges(exist_yn: "Y") { college_cd college_nm } }`
        }).then(result => {
          this.collegeList = result['data']['findColleges']
        })
      }
    },
    selectedCollege (value) {
      this.$apollo.query({
        query: gql`{ findDptByCollege(college_cd: "${value}") { dpt_nm dpt_cd college_cd } }`
      }).then(result => {
        this.dptList = result['data']['findDptByCollege']
      })
    },
    selectedSubCollege (value) {
      this.$apollo.query({
        query: gql`{ findDptByCollege(college_cd: "${value}") { dpt_nm dpt_cd college_cd } }`
      }).then(result => {
        this.dptSubList = result['data']['findDptByCollege'].filter(item => (item.dpt_cd !== this.selectedDpt))
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
    selectedSubCollegeCd (value) {
      this.selectedSubCollege = value
    },
    selectedDptCd (value) {
      this.selectedDpt = value
    },
    selectedSubDptCd (value) {
      this.selectedSubDpt = value
    },
    checkDupNickName () {
      let query = (nickname) => {
        this.$apollo.query({
          query: gql`{ findNickName(nick_nm: "${nickname}") { nick_nm } }`
        }).then(result => {
          if (result.data.findNickName.length > 0) { 
            this.isNickNameDuplicated = true
          } else {
            this.isNickNameDuplicated = false
          }
        })
      }
      if (this.nick_nm) {
        query(this.nick_nm)
      }
    },
    checkDupEmail () {
      this.emailValidation = {
        checked: false,
        duplicated: false,
        checkedNormalButMember: false
      }
      let query = (email) => {
        this.$apollo.query({
          query: gql`{ findEmail(email: "${email}") { email } }`
        }).then(result => {
          this.emailValidation.checked = true
          if (result.data.findEmail.length > 0) {
            this.emailValidation.duplicated = true
          } else {
            this.emailValidation.duplicated = false
          }
        })
      }
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.selectedUserType === 5) {
        if (this.email && re.test(String(this.email).toLowerCase())) {
          if (this.email.includes('ajou.ac.kr')) {
            this.emailValidation.checkedNormalButMember = true
          } else {
            query(this.email)
          }
        }
      } else {
        if (this.email && re.test(String(this.email).toLowerCase()) && this.email.includes('ajou.ac.kr')) {
          query(this.email)
        }
      }
    },
    checkDupID () {
      this.userIDValidation = {
        checked: false,
        duplicated: false
      }
      if (this.userID) {
        this.$apollo.query({
          query: gql`{ findUserID(userId: "${this.userID}") { user_id } }`
        }).then(result => {
          this.userIDValidation.checked = true
          if (result.data.findUserID.length > 0) {
            this.userIDValidation.duplicated = true
          } else {
            this.userIDValidation.duplicated = false
          }
        })
      }
    },
    checkDupIDNum () {
      if (this.userIDNum && this.userIDNum.length === 9) {
        this.$apollo.query({
          query: gql`{ findIdNums(identityNum: ${this.userIDNum}) { identity_num } }`
        }).then(result => {
          this.userIDNumValidation.checked = true
          if (result.data.findIdNums.length > 0) {
            this.userIDNumValidation.duplicated = true
          } else {
            this.userIDNumValidation.duplicated = false
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
          let college
          let dpt
          if (this.hasSubMajor) {
            college = this.selectedCollege + ',' + this.selectedSubCollege
            dpt = this.selectedDpt + ',' + this.selectedSubDpt
          } else {
            college = this.selectedCollege
            dpt = this.selectedDpt
          }
          this.$apollo.mutate({
            mutation: gql`mutation { register(email: "${this.email}", user_id: "${this.userID}", password: "${this.password}", user_nm: "${this.userName}", identity_num: ${this.userIDNum}, user_type: "${this.selectedUserType}", sex_gb: "${this.gender}", college_cd: "${college}", dpt_cd: "${dpt}", nick_nm: "${this.nick_nm}", reg_ip: "${client.data.result.ip}") { user_idx } }`
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
  font-size: 1rem;
  margin: 5px calc(5% + 10px);
  background: #fff;
  box-shadow: 0 2px 2px rgba(36, 37, 38, 0.08);
  +.notice {
    font-size: 14px;
  }
  > .vs__dropdown-toggle + [role="listbox"] > li {
    transition: .2s background-color ease;
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  }
  > .vs__dropdown-toggle + [role="listbox"] > .vs__dropdown-option--highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
