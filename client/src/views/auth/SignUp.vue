<template>
  <div class="wrapper">
    <header data-logo>
      <h2>SIGN UP</h2>
      <small>회원가입</small>
    </header>
    <div class="input-form">
      <div class="input-form-wrapper">
        <div class="input-form-group">
          <v-select
            v-model="selectedUserType"
            placeholder="구성원 여부를 선택해주세요."
            :value="selectedUserType"
            :options="userOptions"
            :reduce="options => options.code"
            label="label"
            @input="selectedUser"
          />
          <div class="notice">
            <b-notification
              v-show="selectedUserType === 'U'"
              type="is-info"
              has-icon
              aria-close-label="Close notification"
            >
              아주 구성원 외의 서비스 이용자는 서비스의 일부 기능이 제한됩니다.
            </b-notification>
            <b-notification
              v-show="selectedUserType !== 'U'"
              type="is-warning"
              has-icon
              aria-close-label="Close notification"
              role="alert"
            >
              아주 구성원은 인증을 위해 ajou.ac.kr 이메일로 가입해주세요.
            </b-notification>
            <span><strong /></span>
          </div>
        </div>
        <div
          v-if="selectedUserType === 'R' || selectedUserType === 'G'"
          class="input-form-group"
        >
          <div class="input-group">
            <v-select
              v-model="selectedCollege"
              :class="{ 'error': errorValidation.college }"
              placeholder="소속대학을 선택하여주세요."
              :value="selectedCollege"
              :options="collegeList"
              :reduce="college => college.college_cd"
              label="college_nm"
              @input="selectedCollegeCd"
            />
            <p
              v-if="errorValidation.college"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.college }"
            >
              {{ errorMsg.college }}
            </p>
          </div>
          <div class="input-group">
            <v-select
              v-if="selectedCollege"
              v-model="selectedDpt"
              :class="{ 'error': errorValidation.dpt }"
              placeholder="소속학과를 선택하여주세요."
              :value="selectedDpt"
              :options="dptList"
              :reduce="dpt => dpt.dpt_cd"
              label="dpt_nm"
              @input="selectedDptCd"
            />
            <p
              v-if="errorValidation.dpt"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.dpt }"
            >
              {{ errorMsg.dpt }}
            </p>
            <div
              v-if="selectedCollege && selectedDpt"
              class="input-form-group input-form-grid"
            >
              <label
                for="smajor"
                role="title"
                class="input-form-grid-item"
              >제2전공(복수전공/부전공)이 있습니다.</label>
              <div class="input-form-grid-item">
                <b-checkbox
                  id="smajor"
                  v-model="hasSubMajor"
                  size="is-small"
                  name="smajor"
                />
              </div>
            </div>
            <div class="input-group">
              <v-select
                v-if="hasSubMajor"
                v-model="selectedSubCollege"
                :class="{ 'error': errorValidation.subCollege }"
                placeholder="소속대학을 선택하여주세요."
                :value="selectedSubCollege"
                :options="collegeList"
                :reduce="college => college.college_cd"
                label="college_nm"
                @input="selectedSubCollegeCd"
              />
              <p
                v-if="errorValidation.subCollege"
                class="auto-validate-noti"
                :class="{ 'error': errorValidation.subCollege }"
              >
                {{ errorMsg.subCollege }}
              </p>
            </div>
            <div class="input-group">
              <v-select
                v-if="hasSubMajor && selectedSubCollege"
                v-model="selectedSubDpt"
                :class="{ 'error': errorValidation.subDpt }"
                placeholder="소속학과를 선택하여주세요."
                :value="selectedSubDpt"
                :options="dptSubList"
                :reduce="dpt => dpt.dpt_cd"
                label="dpt_nm"
                @input="selectedSubDptCd"
              />
              <p
                v-if="errorValidation.subDpt"
                class="auto-validate-noti"
                :class="{ 'error': errorValidation.subDpt }"
              >
                {{ errorMsg.subDpt }}
              </p>
            </div>
          </div>
        </div>
        <div class="input-form-group">
          <input
            v-model="userName"
            type="text"
            :class="{ 'error': errorValidation.user_nm }"
            placeholder="이름"
            required
          >
          <p
            v-if="errorValidation.user_nm"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.user_nm }"
          >
            {{ errorMsg.user_nm }}
          </p>
        </div>
        <div class="input-form-group">
          <input
            v-model="userIDNum"
            name="IDNum"
            :class="{ 'error': errorValidation.user_st_id }"
            :disabled="selectedUserType === 'U' || selectedUserType === 'E'"
            type="text"
            maxlength="9"
            placeholder="학번"
            required
            pattern="[0-9]{9,}"
          >
          <p
            v-if="errorValidation.user_st_id"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.user_st_id }"
          >
            {{ errorMsg.user_st_id }}
          </p>
        </div>
        <div class="input-form-group">
          <input
            v-model="email"
            name="email"
            :class="{ 'error': errorValidation.email }"
            type="email"
            autocapitalize="none"
            placeholder="이메일 (구성원은 @ajou.ac.kr으로만 사용가능)"
            required
          >
          <p
            v-if="email && validatedEmail && !errorValidation.email"
            class="auto-validate-noti"
          >
            사용 가능한 이메일입니다.
          </p>
          <p
            v-if="errorValidation.email"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.email }"
          >
            {{ errorMsg.email }}
          </p>
        </div>
        <div class="input-form-group">
          <input
            v-model="userID"
            name="userID"
            type="text"
            placeholder="아이디"
            :class="{ 'error': errorValidation.user_id }"
            required
            autocapitalize="none"
            pattern="[0-9A-Za-z_]{6,}"
            @blur="checkDupID"
            @keyup.delete="initError('user_id')"
          >
          <p
            v-if="userID && validatedUserID && !errorValidation.user_id"
            class="auto-validate-noti"
          >
            사용 가능한 아이디입니다.
          </p>
          <p
            v-if="errorValidation.user_id"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.user_id }"
          >
            {{ errorMsg.user_id }}
          </p>
        </div>
        <div class="input-form-group">
          <div class="input-group">
            <input
              v-model="password"
              name="password"
              type="password"
              autocapitalize="none"
              pattern=".{8,}"
              placeholder="패스워드"
              required
              :class="{ 'error': errorValidation.user_pw }"
            >
            <p
              v-if="errorValidation.user_pw"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.user_pw }"
            >
              {{ errorMsg.user_pw }}
            </p>
          </div>
          <div class="input-group">
            <input
              v-model="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autocapitalize="none"
              pattern=".{8,}"
              placeholder="패스워드 재확인"
              required
              :class="{ 'error': errorValidation.user_pw_confirm }"
            >
            <p
              v-if="passwordConfirm && validatedPWConfirm && !errorValidation.user_pw_confirm"
              class="auto-validate-noti"
            >
              패스워드 확인이 일치합니다.
            </p>
            <p
              v-if="errorValidation.user_pw_confirm"
              class="auto-validate-noti"
              :class="{ 'error': errorValidation.user_pw_confirm }"
            >
              {{ errorMsg.user_pw_confirm }}
            </p>
          </div>
        </div>
        <div class="input-form-group">
          <input
            id="nickNm"
            v-model="nick_nm"
            type="text"
            name="nick_nm"
            pattern="[(0-9A-Za-z_ㄱ-ㅎ가-힇)]{1,}"
            autocapitalize="none"
            :class="{ 'error': errorValidation.nick_nm }"
            placeholder="서비스에서 사용하실 별명을 입력하여주세요."
            required
            @keyup.delete="initError('nick_nm')"
            @blur="checkDupNickName"
          >
          <p
            v-if="nick_nm && validatedNickname && !errorValidation.nick_nm"
            class="auto-validate-noti"
          >
            사용 가능한 별명입니다.
          </p>
          <p
            v-else-if="errorValidation.nick_nm"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.nick_nm }"
          >
            {{ errorMsg.nick_nm }}
          </p>
        </div>
        <div class="input-form-group">
          <div class="input-form-grid">
            <span
              role="title"
              class="input-form-grid-item"
            >성별 선택</span>
            <div class="input-form-grid-item buttons">
              <b-button
                size="is-small"
                :type="{ 'is-secondary': !gender, 'is-info': genderSelected.M }"
                @click="selectedGender('M')"
              >
                남성
              </b-button>
              <b-button
                size="is-small"
                :type="{ 'is-secondary': !gender, 'is-info': genderSelected.W }"
                @click="selectedGender('W')"
              >
                여성
              </b-button>
            </div>
          </div>
          <p
            v-if="errorValidation.gender"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.gender }"
          >
            {{ errorMsg.gender }}
          </p>
        </div>
        <div class="input-form-group">
          <div class="input-form-grid">
            <label
              for="thumbnail"
              class="input-form-grid-item"
            >
              프로필 이미지 업로드
            </label>
            <div class="input-form-grid-item thumbnail">
              <figure>
                <div class="cover new-gravatar">
                  <b-upload
                    v-model="thumbnail"
                    accept="image/*"
                  >
                    <strong>업로드</strong>
                  </b-upload>
                </div>
                <img
                  v-show="thumbnail"
                  :src="thumbnail_src"
                  alt="Profile"
                >
                <v-gravatar
                  v-show="!thumbnail"
                  :email="email"
                />
              </figure>
            </div>
          </div>
        </div>
        <div class="input-form-group">
          <div class="input-form-grid">
            <label
              for="policy"
              class="input-form-grid-item"
            >서비스 가입전 약관 동의가 필요합니다.</label>
            <div class="input-form-grid-item buttons">
              <b-button
                :disabled="policy.agreed"
                size="is-small"
                :type="{ 'is-primary': !policy.agreed, 'is-success': policy.agreed }"
                expanded
                @click="showPolicy"
              >
                <font-awesome-icon icon="check" />&nbsp;
                <span>{{ policy.msg }}</span>
              </b-button>
            </div>
          </div>
          <p
            v-if="errorValidation.policy"
            class="auto-validate-noti"
            :class="{ 'error': errorValidation.policy }"
          >
            {{ errorMsg.policy }}
          </p>
        </div>
        <div class="input-form-group">
          <b-button
            class="is-medium submit"
            type="is-dark"
            expanded
            @click="signup"
          >
            <font-awesome-icon icon="user-plus" />&nbsp;
            <span>회원가입</span>
          </b-button>
        </div>
      </div>
      <div class="input-form-controls">
        <router-link
          to="/auth/login"
          class="underline underline-inline-block"
        >
          <small>로그인 화면으로</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { DupIDCheck, DupEmailCheck, DupNickCheck, AllColleges, Departments } from '@/assets/graphql/queries'
import { singleUpload, SendEmailConfirmation } from '@/assets/graphql/mutations'
import Policy from '@/vendor/AjouNICE/policy'
export default {
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      userName: '',
      userID: '',
      userIDNum: '',
      thumbnail: null,
      thumbnail_src: '',
      validatedEmail: false,
      validatedUserID: false,
      validatedPWConfirm: false,
      validatedNickname: false,
      userTypes: ['R', 'M', 'E', 'G', 'U'],
      selectedUserType: 'U',
      userOptions: [
        { code: 'R', label: '학부생' },
        { code: 'M', label: '대학원' },
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
      genderSelected: {
        M: false,
        W: false
      },
      nick_nm: '',
      policy: {
        agreed: false,
        msg: '약관 확인 및 동의'
      },
      errorValidation: {
        college: false,
        dpt: false,
        subCollege: false,
        subDpt: false,
        userType: false,
        user_nm: false,
        user_st_id: false,
        email: false,
        user_id: false,
        user_pw: false,
        user_pw_confirm: false,
        gender: false,
        nick_nm: false,
        policy: false
      },
      errorMsg: {
        college: '',
        dpt: '',
        subCollege: '',
        subDpt: '',
        userType: '',
        user_nm: '',
        user_st_id: '',
        email: '',
        user_id: '',
        user_pw: '',
        user_pw_confirm: '',
        gender: '',
        nick_nm: '',
        policy: ''
      }
    }
  },
  watch: {
    userName (value) {
      if (value) {
        this.initError('user_nm')
      }
    },
    userID (value) {
      const re = /[0-9A-Za-z_]{6,}/
      if (value) {
        if (!re.test(value)) {
          this.occurError('user_id', '아이디는 최소 6자 이상, 알파벳과 숫자 및 언더스코어(_)만 사용가능합니다.')
        } else {
          this.initError('user_id')
        }
      }
    },
    userIDNum (value) {
      if (value) {
        this.initError('user_st_id')
      }
      if (!/((19|20)([0-9]{5}))/.test(value)) {
        this.occurError('user_st_id', '학번 형식이 올바르지 않습니다.')
      }
    },
    email (value) {
      this.initError('email')
      this.validatedEmail = false
      this.email = value.toLowerCase()
      const re = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (this.selectedUserType === 'U') {
        if (value && re.test(value)) {
          if (value.includes('@ajou.ac.kr')) {
            this.occurError('email', 'ajou.ac.kr 이메일 사용자는 아주 구성원(학부생/대학원생/졸업생/교직원) 자격으로 가입이 가능합니다.')
          } else {
            this.queryEmailValid(value)
          }
        }
      } else {
        if (value && re.test(value)) {
          if (value.includes('@ajou.ac.kr')) {
            this.queryEmailValid(value)
          } else {
            this.occurError('email', '아주 구성원은 ajou.ac.kr 이메일로만 가입이 가능합니다.')
          }
        }
      }
    },
    password (value) {
      if (value) {
        if (value.length >= 8) {
          this.initError('user_pw')
        } else {
          this.occurError('user_pw', '패스워드는 8자 이상으로 입력해주세요.')
        }
      } else {
        this.initError('user_pw')
      }
      if (this.passwordConfirm) {
        if (value === this.passwordConfirm) {
          this.validatedPWConfirm = true
          this.initError('user_pw_confirm')
        } else {
          this.occurError('user_pw_confirm', '패스워드 확인이 일치하지 않습니다.')
        }
      } else {
        this.initError('user_pw_confirm')
      }
    },
    passwordConfirm (value) {
      if (value) {
        if (value === this.password) {
          this.validatedPWConfirm = true
          this.initError('user_pw_confirm')
        } else {
          this.occurError('user_pw_confirm', '패스워드 확인이 일치하지 않습니다.')
        }
      } else {
        this.initError('user_pw_confirm')
      }
    },
    hasSubMajor (value) {
      if (value) {
        this.selectedSubCollege = ''
        this.selectedSubDpt = ''
      }
    },
    gender (value) {
      if (value) {
        this.initError('gender')
      }
    },
    genderSelected (value) {
      if (!value) {
        this.errorValidation.gender = true
        this.errorMsg.gender = '성별을 선택해주세요.'
      }
    },
    nick_nm (value) {
      if (value) {
        if (/[^(0-9A-Za-z_ㄱ-ㅎ가-힇)]/.test(value)) {
          this.occurError('nick_nm', '별명에 언더스코어(_)를 제외한 특수문자 및 공백, 한글 중성 단독은 포함할 수 없습니다.')
        } else {
          this.initError('nick_nm')
        }
      } else {
        this.initError('nick_nm')
      }
    },
    selectedUserType (value) {
      for (const key of Object.keys(this.errorValidation)) {
        this.initError(key)
      }
      if (value === 'R' || value === 'G') {
        this.$apollo.query({
          query: gql`${AllColleges}`
        }).then(({ data: { allColleges } }) => {
          this.collegeList = _.filter(allColleges, item => (item.exist_yn === 'Y'))
        })
      }
    },
    selectedCollege (value) {
      if (value) {
        this.initError('college')
      }
      this.$apollo.query({
        query: gql`${Departments}`,
        variables: {
          college: value
        }
      }).then(({ data: { departments } }) => {
        this.dptList = departments
      })
    },
    selectedSubCollege (value) {
      if (value) {
        this.initError('subCollege')
      }
      this.$apollo.query({
        query: gql`${Departments}`,
        variables: {
          college: value
        }
      }).then(({ data: { departments } }) => {
        this.dptSubList = departments.filter(item => (item.dpt_cd !== this.selectedDpt))
      })
    },
    selectedDpt (value) {
      if (value) {
        this.initError('dpt')
      }
    },
    selectedSubDpt (value) {
      if (value) {
        this.initError('subDpt')
      }
    },
    thumbnail (file) {
      this.$apollo.mutate({
        mutation: gql`${singleUpload}`,
        variables: {
          uploadType: 'PROFILE',
          file,
          options: {
            PROFILE: {
              raw: true
            }
          }
        }
      }).then(({ data: { imageUpload } }) => {
        this.thumbnail_src = imageUpload
      })
    }
  },
  beforeCreate () {
    document.body.classList.add('auth')
  },
  methods: {
    initError (key) {
      this.errorValidation[key] = false
      this.errorMsg[key] = ''
    },
    occurError (key, msg) {
      this.errorValidation[key] = true
      this.errorMsg[key] = msg
    },
    queryEmailValid (email) {
      this.$apollo.query({
        query: gql`${DupEmailCheck}`,
        variables: {
          email: email
        }
      }).then(({ data: { doesEmailExists } }) => {
        if (doesEmailExists) {
          this.occurError('email', '이미 가입된 계정입니다.')
        } else {
          this.validatedEmail = true
        }
      })
    },
    selectedGender (value) {
      if (value === 'M') {
        this.genderSelected.M = true
        this.gender = 'M'
        this.genderSelected.W = false
      } else if (value === 'W') {
        this.genderSelected.W = true
        this.gender = 'W'
        this.genderSelected.M = false
      }
    },
    selectedUser (value) {
      this.selectedUserType = value
    },
    selectedCollegeCd (value) {
      this.selectedCollege = value
      if (this.selectedDpt) {
        this.selectedDpt = ''
      }
    },
    selectedSubCollegeCd (value) {
      this.selectedSubCollege = value
      if (this.selectedSubDpt) {
        this.selectedSubDpt = ''
      }
    },
    selectedDptCd (value) {
      this.selectedDpt = value
    },
    selectedSubDptCd (value) {
      this.selectedSubDpt = value
    },
    checkDupNickName () {
      if (this.nick_nm && !this.errorValidation.nick_nm) {
        if (!/[^(0-9A-Za-z_ㄱ-ㅎ가-힇)]/.test(this.nick_nm)) {
          this.$apollo.query({
            query: gql`${DupNickCheck}`,
            variables: {
              nick: this.nick_nm
            }
          }).then(({ data: { doesNickExists } }) => {
            if (doesNickExists) {
              this.occurError('nick_nm', '중복된 별명입니다. 다른 별명을 사용해주세요.')
            } else {
              this.validatedNickname = true
              this.initError('nick_nm')
            }
          })
        } else {
          this.occurError('nick_nm', '별명에 언더스코어(_)를 제외한 특수문자 및 공백, 한글 중성 단독은 포함할 수 없습니다.')
        }
      }
    },
    checkDupID () {
      if (this.userID && this.userID.length >= 6) {
        this.$apollo.query({
          query: gql`${DupIDCheck}`,
          variables: {
            id: this.userID
          }
        }).then(({ data: { doesIDExists } }) => {
          if (doesIDExists) {
            this.occurError('user_id', '이미 가입된 계정입니다.')
          } else {
            this.validatedUserID = true
            this.initError('user_id')
          }
        })
      }
    },
    async showPolicy () {
      this.$buefy.dialog.confirm({
        title: '서비스 정책 및 이용약관에 대한 동의',
        message: `${Policy}`,
        cancelText: '동의하지 않음',
        confirmText: '동의',
        trapFocus: true,
        type: 'is-success',
        onConfirm: () => {
          this.initError('policy')
          this.policy.agreed = true
          this.policy.msg = '약관 동의 완료'
          this.$buefy.toast.open('약관에 동의하였습니다.')
        }
      })
    },
    checkValidation () {
      if ((this.selectedUserType === 'R' || this.selectedUserType === 'G') && !this.selectedCollege) {
        this.occurError('college', '항목이 비어있습니다.')
      }
      if (this.selectedUserType !== 'U' && this.selectedCollege && !this.selectedDpt) {
        this.occurError('dpt', '항목이 비어있습니다.')
      }
      if (this.hasSubMajor && !this.selectedSubCollege) {
        this.occurError('subCollege', '항목이 비어있습니다.')
      }
      if (this.hasSubMajor && this.selectedSubCollege && !this.selectedSubDpt) {
        this.occurError('subDpt', '항목이 비어있습니다.')
      }
      if (!this.userName) {
        this.occurError('user_nm', '항목이 비어있습니다.')
      }
      if (!this.email) {
        this.occurError('email', '항목이 비어있습니다.')
      }
      if (this.email && (this.selectedUserType === 'U' && this.email.includes('@ajou.ac.kr'))) {
        this.occurError('email', 'ajou.ac.kr 이메일 사용자는 아주 구성원(학부생/대학원생/졸업생/교직원) 자격으로 가입이 가능합니다.')
      }
      if (!(this.selectedUserType === 'U' || this.selectedUserType === 'E') && !this.userIDNum) {
        this.occurError('user_st_id', '항목이 비어있습니다.')
      }
      if (!this.userID) {
        this.occurError('user_id', '항목이 비어있습니다.')
      }
      if (!this.gender) {
        this.occurError('gender', '항목이 비어있습니다.')
      }
      if (!this.password) {
        this.occurError('user_pw', '항목이 비어있습니다.')
      }
      if (!this.passwordConfirm) {
        this.occurError('user_pw_confirm', '항목이 비어있습니다.')
      }
      if (!this.nick_nm) {
        this.occurError('nick_nm', '항목이 비어있습니다.')
      }
      if (!this.policy.agreed) {
        this.occurError('policy', '약관에 동의하지 않으셨습니다.')
      }
    },
    async signup () {
      this.checkValidation()
      if (Object.values(this.errorValidation).filter(item => item === true).length > 0) {
        this.$buefy.dialog.alert({
          title: '잠깐!',
          message: '<span>누락된 데이터가 있거나 입력된 항목의 내용이 올바른 형식이 아닙니다.</span><br><small><span>해당 항목을 확인 후 다시 시도하여주시기 바랍니다.<br />지속적으로 문제가 발생할 경우 관리자에게 문의하여주세요.</span></small>',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          confirmText: '확인',
          ariaRole: 'alertdialog',
          ariaModal: true
        })
      } else {
        document.body.classList.toggle('loading')
        let college
        let dpt
        if (this.hasSubMajor) {
          college = `${this.selectedCollege},${this.selectedSubCollege}`
          dpt = `${this.selectedDpt},${this.selectedSubDpt}`
        } else {
          college = this.selectedCollege
          dpt = this.selectedDpt
        }
        this.$Axios({
          method: 'POST',
          url: '/api/auth/register',
          data: {
            email: this.email,
            userId: this.userID,
            password: this.password,
            userNm: this.userName,
            identityNum: (this.userIDNum ? this.userIDNum : null),
            userType: this.selectedUserType,
            sexGb: this.gender,
            collegeCd: this.selectedCollege,
            dptCd: this.selectedDpt,
            nickNm: this.nick_nm,
            userProfile: this.thumbnail_src
          }
        }).then(({ data: { result: { code, auth_token } } }) => {
          document.body.classList.toggle('loading')
          if (code === 201) {
            // 이메일 토큰 발송
            this.$apollo.mutate({
              mutation: gql`${SendEmailConfirmation}`,
              variables: {
                name: this.userName,
                email: this.email,
                token: auth_token
              }
            }).then(({ data: { sendRegisterAuthEmail } }) => {
              if (sendRegisterAuthEmail) {
                this.flashSuccess('회원가입 성공! 로그인 후 서비스 이용이 가능합니다.')
                this.$swal({
                  title: '회원가입 완료!',
                  text: '기입하신 이메일 주소로 인증 메일을 발송하였습니다. 인증 후 서비스 이용이 가능합니다.',
                  type: 'success',
                  width: '90vw',
                  footer: '<p>기입하신 이메일 수신함을 확인하여 주시기 바랍니다.</p>',
                  animation: true
                }).then(() => {
                  this.$router.push('/')
                })
              } else {
                // 인증메일 발송 중 에러
                throw Error('Unknown Error while sending auth email')
              }
            }).catch(error => {
              // 인증메일 발송 중 에러
              console.error(error)
            })
          }
        }).catch(error => {
          console.error(error)
          document.body.classList.toggle('loading')
          this.$buefy.dialog.alert({
            title: '잠깐!',
            message: '<span>누락된 데이터가 있거나 입력된 항목의 내용이 올바른 형식이 아닙니다.</span><br><small><span>해당 항목을 확인 후 다시 시도하여주시기 바랍니다.<br />지속적으로 문제가 발생할 경우 관리자에게 문의하여주세요.</span></small>',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            confirmText: '확인',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail {
  > .thumbnail-wrapper {
    position: relative;
    max-height: 80px;
    > .cover {
      position: absolute;
      display: none;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      background: rgba(0,0,0,.8);
    }
    &:hover {
      > .cover {
        display: flex;
        font: {
          weight: 600;
        }
        cursor: pointer;
      }
    }
  }
}

figure {
  position: relative;
  display: inline-block;
  margin: 0;
  width: 80px;
  height: 80px;
  max-width: 80px;
  max-height: 80px;
  overflow: hidden;
  &:hover {
    > .cover {
      cursor: pointer;
      display: flex;
    }
  }
  > .cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.8);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 2;
    > label.upload {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    & strong {
      color: #fff;
    }
  }
  > img {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

</style>
