<template>
    <div fix-page>
        <section data-form-center>
            <header>
                <h1 data-logo><small>Welcome to</small><br />AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티,<br />아주나이스에 오신 것을 환영합니다.</small>
            </header>
            <form data-auth-form @submit.prevent autocomplete="off">
                <header data-logo>
                    <h2>SIGN UP</h2>
                    <small>회원가입</small>
                </header>
                <div class="input-form-wrapper">
                    <div class="input-form">
                        <v-select placeholder="구성원 여부를 선택해주세요." v-model="selectedUserType" :value="this.selectedUserType" @input="selectedUser" :options="this.userOptions" :reduce="options => options.code" label="label"></v-select>
                        <div class="notice">
                            <span v-show="this.selectedUserType === 'U'"><strong>아주 구성원 외의 서비스 이용자는 서비스의 일부 기능이 제한됩니다.</strong></span>
                            <span v-show="this.selectedUserType !== 'U'"><strong>아주 구성원은 인증을 위해 ajou.ac.kr 이메일로 가입해주세요.</strong></span>
                        </div>
                    </div>
                    <div class="input-form" v-if="this.selectedUserType === 'R' || this.selectedUserType === 'G'">
                        <div class="input-group">
                            <v-select :class="{ 'error': this.errorValidation.college }" placeholder="소속대학을 선택하여주세요." v-model="selectedCollege" :value="this.selectedCollege" @input="selectedCollegeCd" :options="this.collegeList" :reduce="college => college.college_cd" label="college_nm"></v-select>
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.college }" v-if="this.errorValidation.college">{{ this.errorMsg.college }}</p>
                        </div>
                        <div class="input-group">
                            <v-select :class="{ 'error': this.errorValidation.dpt }" v-if="this.selectedCollege" placeholder="소속학과를 선택하여주세요." v-model="selectedDpt" :value="this.selectedDpt" @input="selectedDptCd" :options="this.dptList" :reduce="dpt => dpt.dpt_cd" label="dpt_nm"></v-select>
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.dpt }" v-if="this.errorValidation.dpt">{{ this.errorMsg.dpt }}</p>
                            <div class="input-form input-form-horizontal" v-if="this.selectedCollege && this.selectedDpt">
                                <label for="smajor" role="title" class="input-form-title flex-9">제2전공(복수전공/부전공)이 있습니다.</label>
                                <div class="input-form radio-wrapper flex-1">
                                    <b-checkbox size="is-medium" v-model="hasSubMajor" name="smajor" id="smajor"></b-checkbox>
                                </div>
                            </div>
                            <div class="input-group">
                                <v-select :class="{ 'error': this.errorValidation.subCollege }" v-if="this.hasSubMajor" placeholder="소속대학을 선택하여주세요." v-model="selectedSubCollege" :value="this.selectedSubCollege" @input="selectedSubCollegeCd" :options="this.collegeList" :reduce="college => college.college_cd"
                                    label="college_nm"></v-select>
                                <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.subCollege }" v-if="this.errorValidation.subCollege">{{ this.errorMsg.subCollege }}</p>
                            </div>
                            <div class="input-group">
                                <v-select :class="{ 'error': this.errorValidation.subDpt }" v-if="this.hasSubMajor && this.selectedSubCollege" placeholder="소속학과를 선택하여주세요." v-model="selectedSubDpt" :value="this.selectedSubDpt" @input="selectedSubDptCd" :options="this.dptSubList" :reduce="dpt => dpt.dpt_cd"
                                    label="dpt_nm"></v-select>
                                <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.subDpt }" v-if="this.errorValidation.subDpt">{{ this.errorMsg.subDpt }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="input-form">
                        <input type="text" :class="{ 'error': this.errorValidation.user_nm }" v-model="userName" placeholder="이름" required>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_nm }" v-if="this.errorValidation.user_nm">{{ this.errorMsg.user_nm }}</p>
                    </div>
                    <div class="input-form">
                        <input name="IDNum" :class="{ 'error': this.errorValidation.user_st_id }" :disabled="this.selectedUserType === 'U' || this.selectedUserType === 'E'" v-model="userIDNum" type="text" maxlength="9" placeholder="학번" required pattern="[0-9]{9,}">
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_st_id }" v-if="this.errorValidation.user_st_id">{{ this.errorMsg.user_st_id }}</p>
                    </div>
                    <div class="input-form">
                        <input name="email" :class="{ 'error': this.errorValidation.email }" v-model="email" type="email" autocapitalize="none" placeholder="이메일 (구성원은 @ajou.ac.kr으로만 사용가능)" required>
                        <p class="auto-validate-noti" v-if="this.email && this.validatedEmail && !this.errorValidation.email">사용 가능한 이메일입니다.</p>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.email }" v-if="this.errorValidation.email">{{ this.errorMsg.email }}</p>
                    </div>
                    <div class="input-form">
                        <input name="userID" type="text" placeholder="아이디" @blur="checkDupID" @keyup.delete="initError('user_id')" :class="{ 'error': this.errorValidation.user_id }" required v-model="userID" autocapitalize="none" pattern="[0-9A-Za-z_]{6,}">
                        <p class="auto-validate-noti" v-if="this.userID && this.validatedUserID && !this.errorValidation.user_id">사용 가능한 아이디입니다.</p>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_id }" v-if="this.errorValidation.user_id">{{ this.errorMsg.user_id }}</p>
                    </div>
                    <div class="input-form">
                        <div class="input-group">
                            <input name="password" v-model="password" type="password" autocapitalize="none" pattern=".{8,}" placeholder="패스워드" required :class="{ 'error': this.errorValidation.user_pw }">
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_pw }" v-if="this.errorValidation.user_pw">{{ this.errorMsg.user_pw }}</p>
                        </div>
                        <div class="input-group">
                            <input name="passwordConfirm" v-model="passwordConfirm" type="password" autocapitalize="none" pattern=".{8,}" placeholder="패스워드 재확인" required :class="{ 'error': this.errorValidation.user_pw_confirm }">
                            <p class="auto-validate-noti" v-if="this.passwordConfirm && this.validatedPWConfirm && !this.errorValidation.user_pw_confirm">패스워드 확인이 일치합니다.</p>
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.user_pw_confirm }" v-if="this.errorValidation.user_pw_confirm">{{ this.errorMsg.user_pw_confirm }}</p>
                        </div>
                    </div>
                    <div class="input-form">
                        <input type="text" name="nick_nm" id="nickNm" v-model="nick_nm" pattern="[(0-9A-Za-z_ㄱ-ㅎ가-힇)]{1,}" @keyup.delete="initError('nick_nm')" @blur="checkDupNickName" autocapitalize="none" :class="{ 'error': this.errorValidation.nick_nm }" placeholder="서비스에서 사용하실 별명을 입력하여주세요."
                            required />
                        <p class="auto-validate-noti" v-if="this.nick_nm && this.validatedNickname && !this.errorValidation.nick_nm">사용 가능한 별명입니다.</p>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.nick_nm }" v-else-if="this.errorValidation.nick_nm">{{ this.errorMsg.nick_nm }}</p>
                    </div>
                    <div class="input-form">
                        <div class="input-group input-form-horizontal">
                            <span role="title" class="input-form-title flex-6">성별 선택</span>
                            <div class="input-form button-wrapper flex-4">
                                <b-button @click="selectedGender('M')" :type="{ 'is-primary': !this.gender, 'is-info': this.genderSelected.M }">남성</b-button>
                                <b-button @click="selectedGender('W')" :type="{ 'is-primary': !this.gender, 'is-info': this.genderSelected.W }">여성</b-button>
                            </div>
                        </div>
                        <div class="notice">
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.gender }" v-if="this.errorValidation.gender">{{ this.errorMsg.gender }}</p>
                        </div>
                    </div>
                    <div class="input-form">
                        <div class="input-group input-form-horizontal">
                            <label for="policy" class="input-form-title flex-7">아주나이스의 서비스 정책 및 개인정보 수집 이용에 동의합니다.</label>
                            <b-button class="flex-3" @click="showPolicy" :disabled="policy.agreed" :type="{ 'is-primary': !policy.agreed, 'is-success': policy.agreed }" expanded>{{ policy.msg }}</b-button>
                        </div>
                        <div class="notice">
                            <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.policy }" v-if="this.errorValidation.policy">{{ this.errorMsg.policy }}</p>
                        </div>
                    </div>
                    <div class="input-form">
                        <b-button class="is-medium submit" @click="signup" type="is-primary">회원가입</b-button>
                    </div>
                </div>
                <div class="input-form-controls">
                    <router-link to="/" class="underline underline-inline-block">
                        <small>로그인 화면으로</small>
                    </router-link>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import { Button, Checkbox } from 'buefy'
import vSelect from 'vue-select'
import VueSweetalert2 from 'vue-sweetalert2'
import VueFlashMessage from 'vue-flash-message'
import gql from 'graphql-tag'

Vue.component('v-select', vSelect)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(VueSweetalert2)
Vue.use(VueFlashMessage)

export default {
    name: 'signup',
    data() {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            userName: '',
            userID: '',
            userIDNum: '',
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
                'M': false,
                'W': false
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
        userName(value) {
            if (value) {
                this.initError('user_nm')
            }
        },
        userID(value) {
            let re = /[0-9A-Za-z_]{6,}/
            if (value) {
                if (!re.test(value)) {
                    this.occurError('user_id', '아이디는 최소 6자 이상, 알파벳과 숫자 및 언더스코어(_)만 사용가능합니다.')
                } else {
                    this.initError('user_id')
                }
            }
        },
        userIDNum(value) {
            if (value) {
                this.initError('user_st_id')
            }
            if (!/((19|20)([0-9]{5}))/.test(value)) {
                this.occurError('user_st_id', '학번 형식이 올바르지 않습니다.')
            }
        },
        email(value) {
            this.initError('email')
            this.validatedEmail = false
            this.email = value.toLowerCase()
            let re = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
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
        password(value) {
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
        passwordConfirm(value) {
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
        hasSubMajor(value) {
            if (value) {
                this.selectedSubCollege = ''
                this.selectedSubDpt = ''
            }
        },
        gender(value) {
            if (value) {
                this.initError('gender')
            }
        },
        genderSelected(value) {
            if (!value) {
                this.errorValidation.gender = true
                this.errorMsg.gender = '성별을 선택해주세요.'
            }
        },
        nick_nm(value) {
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
        selectedUserType(value) {
            for (let key of Object.keys(this.errorValidation)) {
                this.initError(key)
            }
            if (value === 'R' || value === 'G') {
                this.$apollo.query({
                    query: gql `{ findColleges(exist_yn: "Y") { college_cd college_nm } }`
                }).then(result => {
                    this.collegeList = result['data']['findColleges']
                })
            }
        },
        selectedCollege(value) {
            if (value) {
                this.initError('college')
            }
            this.$apollo.query({
                query: gql `{ findDptByCollege(college_cd: "${value}") { dpt_nm dpt_cd college_cd } }`
            }).then(result => {
                this.dptList = result['data']['findDptByCollege']
            })
        },
        selectedSubCollege(value) {
            if (value) {
                this.initError('subCollege')
            }
            this.$apollo.query({
                query: gql `{ findDptByCollege(college_cd: "${value}") { dpt_nm dpt_cd college_cd } }`
            }).then(result => {
                this.dptSubList = result['data']['findDptByCollege'].filter(item => (item.dpt_cd !== this.selectedDpt))
            })
        },
        selectedDpt(value) {
            if (value) {
                this.initError('dpt')
            }
        },
        selectedSubDpt(value) {
            if (value) {
                this.initError('subDpt')
            }
        }
    },
    methods: {
        initError(key) {
            this.errorValidation[key] = false
            this.errorMsg[key] = ''
        },
        occurError(key, msg) {
            this.errorValidation[key] = true
            this.errorMsg[key] = msg
        },
        queryEmailValid(email) {
            this.$apollo.query({
                query: gql `{ findEmail(email: "${email}") { email } }`
            }).then(result => {
                if (result.data.findEmail.length > 0) {
                    this.occurError('email', '이미 가입된 계정입니다.')
                } else {
                    this.validatedEmail = true
                }
            })
        },
        selectedGender(value) {
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
        selectedUser(value) {
            this.selectedUserType = value
        },
        selectedCollegeCd(value) {
            this.selectedCollege = value
            if (this.selectedDpt) {
                this.selectedDpt = ''
            }
        },
        selectedSubCollegeCd(value) {
            this.selectedSubCollege = value
            if (this.selectedSubDpt) {
                this.selectedSubDpt = ''
            }
        },
        selectedDptCd(value) {
            this.selectedDpt = value
        },
        selectedSubDptCd(value) {
            this.selectedSubDpt = value
        },
        checkDupNickName() {
            if (this.nick_nm && !this.errorValidation.nick_nm) {
                if (!/[^(0-9A-Za-z_ㄱ-ㅎ가-힇)]/.test(this.nick_nm)) {
                    this.$apollo.query({
                        query: gql `{ findNickName(nick_nm: "${this.nick_nm}") { nick_nm } }`
                    }).then(result => {
                        if (result.data.findNickName.length > 0) {
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
        checkDupID() {
            if (this.userID && this.userID.length >= 6) {
                this.$apollo.query({
                    query: gql `{ findUserID(userId: "${this.userID}") { user_id } }`
                }).then(result => {
                    if (result.data.findUserID.length > 0) {
                        this.occurError('user_id', '이미 가입된 계정입니다.')
                    } else {
                        this.validatedUserID = true
                        this.initError('user_id')
                    }
                })
            }
        },
        async showPolicy() {
            let agreePolicy = await this.$swal({
                title: '서비스 정책 및 이용약관에 대한 동의',
                html: `
        <div class="policy-wrapper">
          <img src="/AjouNICE.png" width="80" alt="AjouNICE" /><br />
          <header>서비스 정책 및 이용약관</header><br />
          <div class="policy policy-content">
            <h3>제 1 장 환영합니다!</h3>
            <br />
            <h4>제 1 조 (목적 및 정의)</h4>
            <br />
            &nbsp;&nbsp;아주나이스(이하 ‘서비스’)가 제공하는 서비스를 이용해 주셔서 감사합니다. 서비스는 여러분이 서비스가 제공하는 다양한 컨텐츠 및 기능 등을 의미하며 이하 해당 서비스들을 모두 합하여 “통합서비스” 또는 “서비스”라 함)에 더 가깝고 편리하게 다가갈 수 있도록 ‘아주나이스 통합서비스약관’(이하 ‘본 약관’)을 마련하였습니다.<br />
            &nbsp;&nbsp;여러분은 본 약관에 동의함으로써 통합서비스에 가입하여 통합서비스를 이용할 수 있습니다. 본 약관은 여러분이 통합서비스를 이용하는 데 필요한 권리, 의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항을 규정하고 있으므로 조금만 시간을 내서 주의 깊게 읽어주시기 바랍니다.<br />
            <br />
            <h4>제 2 조 (약관의 효력 및 변경)</h4>
            <br />
            ① 본 약관의 내용은 통합서비스의 화면에 게시하거나 기타의 방법으로 공지하고, 본 약관에 동의한 여러분 모두에게 그 효력이 발생합니다.<br />
            ② 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다. 본 약관이 변경되는 경우 서비스는 변경사항을 시행일자 15일 전부터 여러분에게 서비스 공지사항에서 공지 또는 통지하는 것을 원칙으로 하며, 피치 못하게 여러분에게 불리한 내용으로 변경할 경우에는 그 시행일자 30일 전부터 계정에 등록된 이메일 주소로 이메일 발송하는 방법 등으로 개별적으로 알려 드리겠습니다.<br />
            ③ 서비스가 전 항에 따라 공지 또는 통지를 하면서 공지 또는 통지일로부터 개정약관 시행일 7일 후까지 거부의사를 표시하지 아니하면 승인한 것으로 본다는 뜻을 명확하게 고지하였음에도 여러분의 의사표시가 없는 경우에는 변경된 약관을 승인한 것으로 봅니다.<br />
            ④ 여러분은 변경된 약관에 대하여 거부의사를 표시함으로써 이용계약의 해지를 선택할 수 있습니다.<br />
            ⑤ 본 약관은 여러분이 본 약관에 동의한 날로부터 본 약관 제11조에 따른 이용계약의 해지 시까지 적용하는 것을 원칙으로 합니다. 단, 본 약관의 일부 조항은 이용계약의 해지 후에도 유효하게 적용될 수 있습니다.<br />
            <br />
            <h4>제 3 조 (약관 외 준칙)</h4>
            <br />
            &nbsp;&nbsp;본 약관에 규정되지 않은 사항에 대해서는 관련 법령 또는 통합서비스를 구성하는 개별 서비스의 운영정책 및 규칙, 개별 서비스 내 세부 하위서비스의 이용약관, 아주나이스 운영정책 및 규칙 등(이하 총칭하여 ‘세부지침’)의 규정에 따릅니다. 또한 본 약관과 세부지침의 내용이 충돌할 경우 세부지침에 따릅니다.<br />
            <br />
            <hr />
            <h3>제 2 장 통합서비스 이용계약</h3>
            <br />
            <h4>제 4 조 (계약의 성립)</h4>
            ① 통합서비스에 가입하기 위해서는 아주나이스계정이 필요합니다. 아주나이스계정이 없으신 경우 아주나이스계정을 먼저 생성하시기 바랍니다.<br />
            ② 통합서비스 이용계약은 여러분이 본 약관의 내용에 동의한 후 서비스가 여러분의 아주나이스계정 정보 등을 확인한 후 승낙함으로써 체결됩니다.<br />
            <br />
            <h4>제 5 조 (통합서비스 가입의 제한)</h4>
            <br />
            ① 제4조에 따른 가입 신청자에게 서비스는 원칙적으로 통합서비스 가입을 승낙합니다. 다만, 서비스는 아래 각 호의 경우에는 그 사유가 해소될 때까지 승낙을 유보하거나 승낙하지 않을 수 있습니다.<br />
            &nbsp;&nbsp;1. 여러분이 다른 사람의 명의나 이메일 주소 등 개인정보를 이용하여 통합서비스에 가입하려고 한 경우<br />
            &nbsp;&nbsp;2. 통합서비스 제공 설비 용량에 현실적인 여유가 없는 경우<br />
            &nbsp;&nbsp;3. 통합서비스 제공을 위한 기술적인 부분에 문제가 있다고 판단되는 경우<br />
            &nbsp;&nbsp;4. 기타 서비스가 재정적, 기술적으로 필요하다고 인정하는 경우<br />
            &nbsp;&nbsp;5. 서비스로부터 통합서비스 이용정지 조치 등을 받은 자가 그 조치기간에 통합서비스 이용계약을 임의로 해지하고 재가입을 신청하는 경우<br />
            &nbsp;&nbsp;6. 기타 관련 법령에 위배되거나 세부지침 등 서비스가 정한 기준에 반하는 경우<br />
            ② 만약, 여러분이 위 조건에 위반하여 통합서비스에 가입한 것으로 판명된 때에는 서비스는 즉시 여러분의 통합서비스 이용을 정지시키거나 아주나이스계정을 삭제하는 등 적절한 제한을 할 수 있습니다.<br />
            <br />
            <hr />
            <h3>제 3 장 통합서비스 이용</h3>
            <br />
            <h4>제 6 조 (다양한 서비스의 제공)</h4>
            <br />
            ① 통합서비스 이용계약이 성립되면, 여러분은 통합서비스를 구성하는 아주나이스 서비스를 여러분이 원하는 때에 자유롭게 이용할 수 있고, 개별 서비스에 대한 별도의 이용계약을 체결할 필요는 없습니다.<br />
            ② 다만, 통합서비스 내에서도 일부 세부 하위 서비스의 경우 별도의 이용약관에 동의해야 이용이 가능하며 필요한 추가 정보를 기재하거나, 이메일 주소 승인 등 서비스가 정한 인증 절차를 완료하여야 서비스 이용이 가능합니다.<br />
            ③ 여러분은 통합서비스 가입 후에도 언제든지 통합서비스를 구성하는 개별 서비스 내지 세부 하위 서비스 화면 또는 메뉴에서 제공하는 기능을 이용하여 해당 개별 서비스 또는 세부 하위 서비스의 이용을 종료할 수 있으며, 이 경우 관련 법령에서 정하는 바에 따라 일정기간 보관해야 하는 정보를 제외하고는 해당 서비스 이용기록, 여러분이 작성한 게시물 등 모든 데이터는 즉시 삭제 처리됩니다. 다만, 여러분이 작성한 게시물이 제3자에 의하여 스크랩 또는 다른 공유 기능으로 게시되거나, 여러분이 제3자의 게시물에 댓글 등 게시물을 추가하는 등의 경우에는 해당 게시물 및 댓글은 삭제되지 않으므로 반드시 이용 종료 전에 삭제하시기 바랍니다. 개별 서비스 또는 세부 하위 서비스 이용 종료 시점에 향후 일정기간 해당 서비스의 재이용에 제한이 있을 수 있다는 별도 안내가 있는 경우 해당 안내에 따라 해당 서비스의 재이용에 일정한 시간적 제한이 있을 수 있는 점 유의하여 주시기 바랍니다.<br />
            ④ 전항에 따른 개별 서비스 또는 세부 하위 서비스의 이용 종료는 해당 개별 서비스 또는 세부 하위 서비스의 이용 종료만을 의미하며, 통합서비스를 구성하는 다른 서비스의 이용이 종료되지는 않습니다. 여러분이 통합서비스 전체의 이용을 종료하고 싶은 경우에는 본 약관 제13조에서 정한 바처럼 통합서비스 이용계약을 해지하여야 합니다.<br />
            ⑤ 서비스는 여러분에게 게시판 서비스 등 여러분이 인터넷과 모바일로 즐길 수 있는 다양한 서비스를 제공합니다. 여러분은 스마트폰의 어플리케이션 스토어 등에서 서비스를 다운받아 설치하거나 직접 PC에 설치 혹은 웹페이지에 접속하여 서비스를 이용할 수 있습니다. 그런데 서비스는 여러분이 원하는 다양한 서비스를 시시각각 제공하기 때문에 서비스의 자세한 내용은 별도로 알려드릴 수밖에 없습니다. 이러한 서비스의 사정을 이해하여 주시길 바라며, 서비스도 개별적인 서비스 이용방법을 해당 안내 및 고지사항에서 더 상세하게 안내하고 있으니 언제든지 확인하여 주시기 바랍니다.<br />
            ⑥ 서비스는 더 나은 통합서비스의 제공을 위하여 여러분에게 통합서비스의 이용과 관련된 각종 고지, 관리 메시지 및 기타 광고를 비롯한 다양한 정보를 통합서비스 내에 표시하거나 여러분의 아주나이스계정 정보에 등록되어 있는 이메일로 직접 발송할 수 있습니다. 단, 광고성 정보 전송의 경우에는 사전에 수신에 동의한 경우에만 전송합니다.<br />
            ⑦ 통합서비스 이용 중 시스템 오류 등 문제점을 발견하신다면 언제든지 개발팀으로 알려주시기 바랍니다.<br />
            ⑧ 여러분이 통합서비스를 이용하는 과정에서 Wi-Fi 무선인터넷을 사용하지 않고, 가입하신 이동통신사의 무선인터넷에 연결하여 이용하는 경우 이동통신사로부터 여러분에게 별도의 데이터 통신요금이 부과될 수 있는 점을 유의하여 주시기 바랍니다. 통합서비스 이용 과정에서 발생하는 데이터 통신요금은 여러분이 여러분의 비용과 책임 하에 이동통신사에 납부하셔야 합니다. 데이터 통신요금에 대한 자세한 안내는 여러분이 가입하신 이동통신사에 문의하시기 바랍니다.<br />
            <br />
            <h4>제 7 조 (통합서비스의 변경 및 종료)</h4>
            <br />
            ① 서비스는 통합서비스를 365일, 24시간 쉬지 않고 제공하기 위하여 최선의 노력을 다합니다. 다만, 아래 각 호의 경우 통합서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.<br />
            &nbsp;&nbsp;1. 통합서비스용 설비의 유지·보수 등을 위한 정기 또는 임시 점검의 경우<br />
            &nbsp;&nbsp;2. 정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 통합서비스 이용에 지장이 있는 경우<br />
            &nbsp;&nbsp;3. 관계사와의 계약 종료, 정부의 명령/규제 등 서비스의 제반 사정으로 통합서비스의 전부 또는 일부를 유지할 수 없는 경우<br />
            &nbsp;&nbsp;4. 기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우<br />
            ② 전항에 의한 통합서비스 중단의 경우에는 미리 제17조에서 정한 방법으로 여러분에게 통지 내지 공지하겠습니다. 다만, 서비스로서도 예측할 수 없거나 통제할 수 없는 사유(서비스의 과실이 없는 디스크 내지 서버 장애, 시스템 다운 등)로 인해 사전 통지 내지 공지가 불가능한 경우에는 그러하지 아니합니다. 이러한 경우에도 서비스가 상황을 파악하는 즉시 최대한 빠른 시일 내에 서비스를 복구하도록 노력하겠습니다.<br />
            <br />
            <h4>제 8 조 (게시물의 관리)</h4>
            <br />
            ① 여러분의 게시물이 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 ‘정보통신망법’)및 저작권법 등 관련 법령에 위반되는 내용을 포함하는 경우, 권리자는 서비스에 관련 법령이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 서비스는 관련 법령에 따라 조치를 취합니다.<br />
            ② 서비스는 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 서비스의 정책 및 관련 법령에 위반되는 경우에는 관련 법령에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.<br />
            ③ 위와 관련된 세부 절차는 정보통신망법 및 저작권법이 규정한 범위 내에서 서비스가 정한 권리침해 신고 절차 에 따릅니다.<br />
            <br />
            <h4>제 9 조 (권리의 귀속 및 저작물의 이용)</h4>
            <br />
            ① 여러분은 사진, 글, 정보, (동)영상, 통합서비스 또는 서비스에 대한 의견이나 제안 등 콘텐츠(이하 ‘게시물’)를 통합서비스 내에 게시할 수 있으며, 이러한 게시물에 대한 저작권을 포함한 지적재산권은 당연히 권리자가 계속하여 보유합니다.<br />
            ② 여러분이 통합서비스 내에 게시물을 게시하는 경우, 해당 게시물이 통합서비스에 포함되는 개별 서비스에 노출될 수 있고 이에 필요한 범위 내에서 사용, 저장, 수정, 복제, 공중송신, 전시, 배포 등의 방식으로 이용할 수 있도록 사용을 허락하는 전 세계적인 라이선스를 서비스에게 제공하게 됩니다. 다시 한 번 알려드리지만, 본 라이선스에서 여러분이 서비스에게 부여하는 권리는 통합서비스를 운영, 개선, 홍보하고 새로운 서비스를 개발하기 위한 범위 내에서 사용됩니다. 일부 개별 서비스에서는 여러분이 제공한 콘텐츠에 접근하거나 이를 삭제하는 방법을 제공할 수 있습니다. 또한 일부 서비스에서는 제공된 콘텐츠에 대한 서비스의 사용 범위를 제한하는 설정이 있습니다.<br />
            ③ 여러분은 서비스에 제공한 콘텐츠에 대해 서비스에 라이선스를 부여하기 위해 필요한 권리를 보유해야 합니다. 이러한 권리를 보유하지 않아 발생하는 모든 문제에 대해서는 게시자가 책임을 부담하게 됩니다. 또한, 여러분은 음란하거나 폭력적이거나 기타 공서양속 및 법령에 위반하는 콘텐츠를 공개 또는 게시할 수 없습니다.<br />
            ④ 서비스는 여러분의 콘텐츠가 관련 법령에 위반되거나 음란 또는 유해한 게시물, 차별 갈등을 조장하는 게시물, 도배 · 광고 · 홍보 · 스팸성 게시물, 계정을 양도 또는 거래하는 내용의 게시물, 타인을 사칭하는 게시물 등이라고 판단되는 경우 이를 삭제하거나 게시를 거부할 수 있습니다. 다만 서비스가 모든 콘텐츠를 검토할 의무가 있는 것은 아닙니다. 누군가 여러분의 권리를 침해하였다면, 개발팀을 통해 게시중단 요청에 대한 도움을 받으실 수 있습니다. 위와 관련된 구체적인 기준 및 이용제한 절차의 내용은 아주나이스 운영정책에서 확인하실 수 있습니다.<br />
            ⑤ 통합서비스에서는 서비스가 보유하지 않은 일부 콘텐츠가 표시될 수 있습니다. 그러한 콘텐츠에 대해서는 콘텐츠를 제공한 주체가 단독으로 모든 책임을 부담하게 됩니다. 여러분이 통합서비스를 이용하더라도 다른 이용자의 콘텐츠에 대하여 어떠한 권리를 가지게 되는 것은 아닙니다. 여러분이 다른 이용자의 콘텐츠를 사용하기 위해서는 콘텐츠 소유자로부터 별도로 허락을 받아야 합니다.<br />
            <br />
            <h4>제 10 조 (통합서비스 이용 방법 및 주의점)</h4>
            <br />
            ① 여러분은 통합서비스를 자유롭게 이용할 수 있으나, 아래 각 호의 행위는 하여서는 안 됩니다.<br />
            &nbsp;&nbsp;1. 이용 신청 또는 변경 시 허위 사실을 기재하거나, 다른 사람의 아주나이스계정 및 비밀번호를 도용, 부정하게 사용하거나, 다른 사람의 명의를 사용하거나 명의자의 허락 없이 인증 등을 수행하는 행위<br />
            &nbsp;&nbsp;2. 서비스의 서비스 정보를 이용하여 얻은 정보를 서비스의 사전 승낙 없이 복제 또는 유통시키거나 상업적으로 이용하는 행위<br />
            &nbsp;&nbsp;3. 서비스 내에서 다운로드 또는 스트리밍을 통해 제공받은 음원을 사적 목적으로 이용하는 것 외에, 공공장소 및 영리를 목적으로 하는 영업장, 매장 등에서 재생하는 등의 방법으로 이용하는 행위<br />
            &nbsp;&nbsp;4. 타인의 명예를 손상시키거나 불이익을 주는 행위<br />
            &nbsp;&nbsp;5. 게시판 등에 음란물을 게재하거나 음란사이트를 연결(링크)하는 행위<br />
            &nbsp;&nbsp;6. 서비스 또는 제3자의 저작권 등 기타 권리를 침해하는 행위(국내외 제3자의 저작권 등을 침해하는 행위로서 서비스가 IP 접속 차단 등 기술적인 조치를 통하여 타인에 대한 권리 침해 방지 조치를 취하였음에도 불구하고 이용자가 고의로 또는 서비스를 기망하는 수단과 방법을 통하여 서비스에 접속 하는 등 제3자의 저작권 등을 침해하는 행위를 포함합니다)<br />
            &nbsp;&nbsp;7. 서비스 내에 서비스나 제3자 등에 대한 허위의 사실을 게시하는 행위<br />
            &nbsp;&nbsp;8. 공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형, 음성 등을 타인에게 유포하는 행위<br />
            &nbsp;&nbsp;9. 통합서비스와 관련된 설비의 오동작이나 정보 등의 파괴 및 혼란을 유발시키는 컴퓨터 바이러스 감염 자료를 등록 또는 유포하는 행위<br />
            &nbsp;&nbsp;10. 통합서비스의 운영을 고의로 방해하거나 안정적 운영을 방해할 수 있는 정보 및 수신자의 명시적인 수신거부의사에 반하여 광고성 정보 또는 스팸메일(Spam Mail)을 전송하는 행위<br />
            &nbsp;&nbsp;11. 서비스의 동의 없이 서비스 또는 이에 포함된 소프트웨어의 일부를 복사, 수정, 배포, 판매, 양도, 대여, 담보제공하거나 타인에게 그 이용을 허락하는 행위와 소프트웨어를 역설계하거나 소스 코드의 추출을 시도하는 등 서비스를 복제, 분해 또는 모방하거나 기타 변형하는 행위<br />
            &nbsp;&nbsp;12. 타인으로 가장하는 행위 및 타인과의 관계를 허위로 명시하는 행위<br />
            &nbsp;&nbsp;13. 다른 이용자의 개인정보를 수집, 저장, 공개하는 행위<br />
            &nbsp;&nbsp;14. 자기 또는 타인에게 재산상의 이익을 주거나 타인에게 손해를 가할 목적으로 허위의 정보를 유통시키는 행위<br />
            &nbsp;&nbsp;15. 재물을 걸고 도박하거나 사행행위를 하는 행위<br />
            &nbsp;&nbsp;16. 윤락행위를 알선하거나 음행을 매개하는 내용의 정보를 유통시키는 행위<br />
            &nbsp;&nbsp;17. 수치심이나 혐오감 또는 공포심을 일으키는 말이나 음향, 글이나 화상 또는 영상을 계속하여 상대방에게 도달하게 하여 상대방의 일상적 생활을 방해하는 행위<br />
            &nbsp;&nbsp;18. 관련 법령에 의하여 그 전송 또는 게시가 금지되는 정보(컴퓨터 프로그램 포함)의 전송 또는 게시 행위<br />
            &nbsp;&nbsp;19. 서비스 또는 관계사의 직원이나 운영자를 가장하거나 사칭하여 또는 타인의 명의를 도용하여 글을 게시하거나 E-mail을 발송하는 행위<br />
            &nbsp;&nbsp;20. 컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해, 파괴할 목적으로 고안된 소프트웨어 바이러스, 기타 다른 컴퓨터 코드, 파일, 프로그램을 포함하고 있는 자료를 게시하거나 E-mail등으로 발송하는 행위<br />
            &nbsp;&nbsp;21. 스토킹(stalking), 허위 또는 악의적 신고 남용 등 다른 이용자를 괴롭히는 행위<br />
            &nbsp;&nbsp;22. 1개월 이내 통합서비스 가입 및 유료서비스 구매 후 다시 해지하는 행위를 2회 이상 반복하는 등 통합서비스를 부당하게 악용하는 행위<br />
            &nbsp;&nbsp;23. 기타 현행 법령, 본 약관 및 서비스가 제공하는 서비스 관련 세부지침을 위반하는 행위<br />
            ② 여러분은 서비스의 이용 권한, 기타 이용계약상 지위를 타인에게 양도·증여할 수 없으며, 담보로 제공할 수 없습니다.<br />
            ③ 여러분의 자격 혹은 나이에 따라 아래 각 호처럼 통합서비스 이용의 일부가 제한될 수 있습니다.<br />
            &nbsp;&nbsp;1. 만19세 미만의 이용자는(단, 만 19세에 도달하는 해의 1월 1일을 맞이한 자는 제외, 이하 본 조에서 동일함) 정보통신망법 및 청소년보호법의 규정에 의하여 청소년유해매체물은 이용할 수 없습니다.<br />
            &nbsp;&nbsp;2. 청소년유해매체물을 이용하시기 위해서는 만 19세 이상이어야 하며, 정보통신망법 및 청소년보호법의 규정에 의하여 실명인증을 통해 본인 및 연령 인증을 받으셔야 합니다. 인증을 받지 않으시면, 해당 서비스의 이용이 제한됩니다.<br />
            ④ 혹시라도 여러분이 관련 법령, 서비스의 모든 약관 또는 정책을 준수하지 않는다면, 서비스는 여러분의 위반행위 등을 조사할 수 있고, 해당 게시물 등을 삭제 또는 임시 삭제하거나 여러분의 통합서비스 전체 또는 통합서비스를 구성하는 일부 개별 서비스의 이용을 잠시 또는 계속하여 중단하거나, 통합서비스 재가입 또는 일부 개별 서비스의 재이용에 제한을 둘 수도 있습니다.<br />
            ⑤ 이용 제한은 위반 활동의 누적 정도에 따라 한시적 제한에서 영구적 제한으로 단계적 제한하는 것을 원칙으로 하지만, 음란한 내용의 게시와 유포 및 사행성 도박 홍보 등 관련 법령에서 금지하는 명백한 불법행위나 타인의 권리침해로서 긴급한 위험 또는 피해 차단이 요구되는 사안에 대해서는 위반 활동 횟수의 누적 정도와 관계 없이 즉시 영구적으로 이용이 제한될 수 있습니다.<br />
            ⑥ 본 조에서 정한 사항 및 그 밖에 통합서비스의 이용에 관한 자세한 사항은 아주나이스 운영정책 등을 참고해 주시기 바랍니다.<br />
            <br />
            <h4>제 11 조 (이용계약 해지)</h4>
            <br />
            ① 여러분이 아주나이스계정 탈퇴를 하는 경우 통합서비스 이용계약도 자동으로 해지됩니다.<br />
            ② 통합서비스 이용계약 해지를 원하는 경우 여러분은 언제든지 서비스 내 제공되는 메뉴를 이용하여 해지 신청을 할 수 있으며,서비스는 법령이 정하는 바에 따라 신속히 처리하겠습니다.<br />
            ③ 통합서비스 이용계약이 해지되면 관련 법령 및 아주나이스 개인정보 처리방침에 따라 여러분의 일정 정보를 보유하는 경우를 제외하고는 여러분의 정보나 여러분이 작성한 게시물 등 모든 데이터는 삭제됩니다. 다만, 여러분이 작성한 게시물이 제3자에 의하여 스크랩 또는 다른 공유 기능으로 게시되거나, 여러분이 제3자의 게시물에 댓글 등 게시물을 추가하는 등의 경우에는 해당 게시물 및 댓글은 삭제되지 않으므로 반드시 해지 신청 전에 삭제하시기 바랍니다.<br />
            ④ 전항에 따라 여러분이 삭제하지 않은 게시물은 다른 이용자의 정상적 서비스 이용을 위하여 필요한 범위 내에서 통합서비스 내에 삭제되지 않고 남아 있게 됩니다.<br />
            ⑤ 유료서비스 이용계약의 해지는 여러분의 유료서비스 이용계약 해지 신청 및 서비스의 승낙에 의해 성립하게 되고, 환불할 금액이 있는 경우 환불도 이루어 지게 됩니다. 다만 각 세부 하위서비스의 유료서비스에서 본 약관과 다른 계약해지 방법 및 효과를 규정하고 있는 경우 각 유료서비스 약관 및 관련 세부지침에서 정한 바에 따릅니다.<br />
            ⑥ 통합서비스를 구성하는 일부 개별 서비스의 경우 일정기간 동안 해당 개별 서비스를 이용하지 않을 경우 여러분의 정보를 파기하거나 분리 보관할 수 있으며, 또는 해당 개별 서비스 기능의 일부 또는 전부를 이용할 수 없도록 제한할 수 있습니다. 자세한 사항은 개별 서비스의 세부지침에서 확인하실 수 있습니다.<br />
            ⑦ 통합서비스 이용계약이 해지된 경우라도 여러분은 다시 서비스에 대하여 이용계약의 체결을 신청할 수 있습니다. 다만, 여러분이 관련 법령, 본 약관 및 세부지침을 준수하지 않아 서비스의 이용이 중단된 상태에서 이용계약을 해지한 후 다시 이용계약 체결을 신청하는 경우에는 통합서비스 가입에 일정기간 시간적 제한이 있을 수 있습니다. 또한 통합서비스를 구성하는 일부 개별 서비스의 경우 다시 통합서비스 이용계약을 체결한 후에도 해당 개별 서비스를 바로 이용하는 것에는 제6조 제3항에서 정한 바와 같이 일정한 시간적 제한 등이 따를 수 있습니다.<br />
            <br />
            <h4>제 12 조 (개인정보의 보호)</h4>
            <br />
            &nbsp;&nbsp;여러분의 개인정보의 안전한 처리는 서비스에게 있어 가장 중요한 일 중 하나입니다. 여러분의 개인정보는 통합서비스의 원활한 제공을 위하여 여러분이 동의한 목적과 범위 내에서만 이용됩니다. 관련 법령에 의하거나 여러분이 별도로 동의하지 아니하는 한 서비스가 여러분의 개인정보를 제3자에게 제공하는 일은 결코 없으므로, 안심하셔도 좋습니다. 서비스가 여러분의 개인정보를 안전하게 처리하기 위하여 기울이는 노력이나 기타 자세한 사항은 아주나이스 개인정보처리방침 등을 참고해 주시기 바랍니다.<br />
            <br />
            <hr />
            <h3>제 4 장 기타</h3>
            <br />
            <h4>제 13 조 (손해배상 등)</h4>
            <br />
            ① 서비스는 관련 법령상 허용되는 한도 내에서 통합서비스와 관련하여 본 약관에 명시되지 않은 어떠한 구체적인 사항에 대한 약정이나 보증을 하지 않습니다. 또한, 서비스는 CP(Contents Provider)가 제공하거나 여러분이 작성하는 등의 방법으로 통합서비스에 게재된 정보, 자료, 사실의 신뢰도, 정확성 등에 대해서는 보증을 하지 않으며, 서비스의 과실 없이 발생된 여러분의 손해에 대하여는 책임을 부담하지 아니합니다.<br />
            ② 서비스는 아래와 같은 손해에 대해서는 책임을 부담하지 않습니다. 또한 서비스는 법률상 허용되는 한도 내에서 간접 손해, 특별 손해, 결과적 손해, 징계적 손해, 및 징벌적 손해에 대한 책임을 부담하지 않습니다.<br />
            &nbsp;&nbsp;1. 천재지변 또는 이에 준하는 불가항력의 상태에서 발생한 손해<br />
            &nbsp;&nbsp;2. 여러분의 귀책사유로 통합서비스 이용에 장애가 발생한 경우<br />
            &nbsp;&nbsp;3. 통합서비스에 접속 또는 이용과정에서 발생하는 개인적인 손해<br />
            &nbsp;&nbsp;4. 제3자가 불법적으로 서비스의 서버에 접속하거나 서버를 이용함으로써 발생하는 손해<br />
            &nbsp;&nbsp;5. 제3자가 서비스 서버에 대한 전송 또는 서비스 서버로부터의 전송을 방해함으로써 발생하는 손해<br />
            &nbsp;&nbsp;6. 제3자가 악성 프로그램을 전송 또는 유포함으로써 발생하는 손해<br />
            &nbsp;&nbsp;7. 전송된 데이터의 생략, 누락, 파괴 등으로 발생한 손해, 명예훼손 등 제3자가 서비스를 이용하는 과정에서 발생된 손해<br />
            &nbsp;&nbsp;8. 기타 서비스의 고의 또는 과실이 없는 사유로 인해 발생한 손해<br />
            ③ 서비스는 여러분이 통합서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며 그 밖에 통합서비스를 통하여 얻은 자료로 인한 손해 등에 대하여도 책임을 지지 않습니다.<br />
            ④ 서비스는 서비스의 과실이 없는 한 여러분 상호간 또는 여러분과 제3자 상호간에 통합서비스를 매개로 발생한 분쟁에 대해서는 개입할 의무가 없으며 이로 인한 손해를 배상할 책임도 없습니다.<br />
            <br />
            <h4>제 14 조 (통지 및 공지)</h4>
            <br />
            &nbsp;&nbsp;서비스는 여러분과의 의견 교환을 소중하게 생각합니다. 여러분은 언제든지 아주나이스 개발팀에 의견을 개진할 수 있습니다. 서비스 이용자 전체에 대한 공지는 칠(7)일 이상 서비스 공지사항란에 게시함으로써 효력이 발생합니다. 여러분에게 중대한 영향을 미치는 사항의 경우에는 아주나이스계정에 등록된 이메일 주소로 이메일을 발송하는 방법 등으로 개별적으로 알려 드리겠습니다.<br />
            <br />
            공고일자 : 2020년 1월 1일<br />
            시행일자 : 2020년 1월 1일<br />
            <br />
          </div>
        </div>`,
                width: '90vw',
                confirmButtonText: '동의',
                cancelButtonText: '동의하지 않음',
                showCancelButton: true,
                showCloseButton: false,
                footer: '<span><strong>약관에 동의하셔야만 서비스 이용이 가능합니다.</strong></span>',
                allowOutsideClick: false
            })
            if (agreePolicy.value) {
                this.initError('policy')
                this.policy.agreed = true
                this.policy.msg = '약관 동의 완료'
            }
        },
        checkValidation() {
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
        async signup() {
            this.checkValidation()
            if (Object.values(this.errorValidation).filter(item => item === true).length > 0) {
                this.$swal({
                    title: '잠깐!',
                    text: '누락된 데이터가 있거나 입력된 항목의 내용이 올바른 형식이 아닙니다.',
                    type: 'error',
                    width: '90vw',
                    footer: '<span>해당 항목을 확인 후 다시 시도하여주시기 바랍니다.<br />지속적으로 문제가 발생할 경우 관리자에게 문의하여주세요.</span>'
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
                        collegeCd: this.college,
                        dptCd: this.dpt,
                        nickNm: this.nick_nm
                    }
                }).then(({ data }) => {
                    document.body.classList.toggle('loading')
                    if (data.result.code === 201) {
                        // 이메일 토큰 발송
                        this.$apollo.mutate({
                            mutation: gql `mutation { sendRegisterAuthEmail(user_nm: "${this.userName}", email: "${this.email}", auth_token: "${data.result.auth_token}") }`
                        }).then(result => {
                            if (result) {
                                this.flash('회원가입 성공! 로그인 후 서비스 이용이 가능합니다.', 'success')
                                this.$swal({
                                    title: '회원가입 완료!',
                                    text: '기입하신 이메일 주소로 인증 메일을 발송하였습니다. 인증 후 서비스 이용이 가능합니다.',
                                    type: 'success',
                                    width: '90vw',
                                    footer: '<p>기입하신 이메일 수신함을 확인하여 주시기 바랍니다.</p>',
                                    animation: true
                                }).then(result => {
                                    window.location = '/'
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
                    this.$swal({
                        title: '실패하였습니다!',
                        text: '회원가입에 필요한 데이터가 누락되었습니다. 항목을 다시 확인하여주세요.',
                        width: '90vw',
                        type: 'error',
                        animation: true,
                        footer: '<a>가입에 문제가 있다면? 관리자에게 해당 내용을 문의하여주세요.</a>'
                    })
                })
            }
        }
    },
    beforeCreate() {
        document.body.classList.add('auth')
    }
}
</script>

<style lang="scss" scoped>
#swal2-content {
    >.policy-wrapper {
        >header {
            font-weight: bold;
            font-size: 1.2rem;
        }
        >p {
            text-align: left;
            line-height: 1.6;
        }
    }
}

.v-select {
    margin: 5px calc(5% + 10px);
    +.notice {
        font-size: 14px;
    }
}
</style>
