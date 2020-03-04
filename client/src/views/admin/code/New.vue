<template>
  <section class="codes">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 코드 등록</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="type">학부/학과 구분</label>
        <div class="input-form-wrapper">
          <v-select
            placeholder="학부/학과 여부를 선택해주세요."
            :options="options"
            :class="{'error': validation.mode === false }"
            @input="selectedType"
          >
            <template v-slot:no-options>
              <font-awesome-icon icon="times" />&nbsp;
              <span>일치하는 옵션이 없어요.</span>
            </template>
          </v-select>
          <p
            v-show="validation.mode === false"
            class="auto-validate-noti"
            :class="{'error': validation.mode === false }"
          >
            {{ invalidMsg.mode }}
          </p>
        </div>
      </div>
      <div
        v-show="mode === 'dpt'"
        class="input-form-group"
      >
        <label for="college">소속 학부</label>
        <div class="input-form-wrapper">
          <v-select
            v-model="form.college_cd"
            placeholder="소속대학을 선택해주세요."
            :class="{'error': validation.dptParent === false }"
            :value="form.college_cd"
            :options="colleges"
            :reduce="college => college.college_cd"
            label="college_nm"
            @input="selectedCollegeCd"
          >
            <template v-slot:no-options>
              일치하는 옵션이 없어요.
            </template>
          </v-select>
          <p
            v-show="validation.dptParent === false"
            class="auto-validate-noti"
            :class="{'error': validation.dptParent === false }"
          >
            {{ invalidMsg.dptParent }}
          </p>
        </div>
      </div>
      <div
        v-show="mode === 'college' || (mode === 'dpt' && validation.dptParent)"
        class="input-form-group"
      >
        <label for="code">코드</label>
        <div class="input-form-wrapper">
          <input
            id="code"
            v-model="code"
            type="text"
            name="code"
            autocapitalize="on"
            :class="{'error': validation.code === false }"
            :placeholder="placeholder.code"
            :maxlength="maxLength"
            :pattern="regex[mode]"
            @blur="validateCode"
          >
          <p
            v-show="validation.code === false"
            class="auto-validate-noti"
            :class="{'error': validation.code === false }"
          >
            {{ invalidMsg.code }}
          </p>
        </div>
      </div>
      <div
        v-show="mode === 'college' || (mode === 'dpt' && validation.dptParent)"
        class="input-form-group"
      >
        <label for="name">명칭</label>
        <div class="input-form-wrapper">
          <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            no-validate
            :class="{'error': validation.name === false }"
            :placeholder="placeholder.name"
          >
          <p
            v-show="validation.name === false"
            class="auto-validate-noti"
            :class="{'error': validation.name === false }"
          >
            {{ invalidMsg.name }}
          </p>
        </div>
      </div>
      <div
        v-show="mode === 'college' || (mode === 'dpt' && validation.dptParent)"
        class="input-form-group"
      >
        <label for="title">현재 존재여부</label>
        <b-switch
          v-model="form.exist_yn"
          true-value="Y"
          false-value="N"
        >
          {{ private_yn_label }}
        </b-switch>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          @click="submit"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>등록</span>
        </b-button>
        <b-button
          type="is-dark"
          size="is-small"
          @click="$router.go(-1)"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { AllColleges, College, Department } from '@/assets/graphql/queries'
import { modCollege, modDepartment } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      private_yn_label: '공개',
      mode: '',
      colleges: [],
      options: [
        { label: '학부', code: 'college' },
        { label: '학과', code: 'dpt' }
      ],
      placeholder: {
        code: '사용할 코드를 명명해주세요. 예) 학부: C_AX, 학과: C_AX01',
        name: '이 코드는 어떤 곳을 의미하나요? 예) OO학과, OO대학'
      },
      code: '',
      name: '',
      maxLength: 6,
      regex: {
        college: '[A-Z]{1}_[A-Z]{2}',
        dpt: '[A-Z]{1}_[A-Z]{2}[0-9]{2}'
      },
      form: {
        college_nm: '',
        college_cd: '',
        dpt_cd: '',
        dpt_nm: '',
        exist_yn: 'Y',
        ip: this.$store.state.user.access_loc
      },
      validation: {
        mode: null,
        code: null,
        name: null,
        dptParent: null
      },
      invalidMsg: {
        mode: '',
        code: '',
        name: '',
        dptParent: ''
      },
      validated: false
    }
  },
  watch: {
    name (value) {
      this.validateName()
    },
    code (value) {
      this.validateCode()
    },
    'form.exist_yn' (value) {
      if (value === 'Y') {
        this.private_yn_label = '공개'
      } else if (value === 'N') {
        this.private_yn_label = '비공개'
      }
    },
    mode (code) {
      if (code === 'dpt') {
        this.$apollo.query({
          query: gql`${AllColleges}`
        }).then(({ data: { allColleges } }) => {
          this.colleges = allColleges
        })
      }
    }
  },
  methods: {
    toggleInputValid (key, bool, msg = '') {
      if (!bool) {
        this.validated = false
      }
      this.validation[key] = bool
      if (msg) {
        this.invalidMsg[key] = msg
      }
    },
    validateDptParent () {
      if (this.mode === 'dpt' && this.form.college_cd) {
        this.toggleInputValid('dptParent', true)
      } else {
        this.toggleInputValid('dptParent', false, '소속 학부를 선택해주세요.')
      }
    },
    validateName () {
      if (this.name) {
        this.toggleInputValid('name', true)
      } else {
        this.toggleInputValid('name', false, '명칭을 입력하지 않았습니다.')
      }
    },
    validateCode () {
      if (this.mode === 'college') {
        if (new RegExp(this.regex[this.mode]).test(this.code)) {
          this.checkCodeExists()
        } else {
          this.toggleInputValid('code', false, '코드 명명 규칙에 어긋납니다. (예. 학부: C_TS, 학과: C_TS01)')
        }
      } else if (this.mode === 'dpt') {
        if (new RegExp(this.regex[this.mode]).test(this.code)) {
          if (this.code.includes(this.form.college_cd)) {
            this.checkCodeExists()
          } else {
            this.toggleInputValid('code', false, `학과 코드는 학부 코드를 포함해야합니다. 포함: ${this.form.college_cd}`)
          }
        } else {
          this.toggleInputValid('code', false, '코드 명명 규칙에 어긋납니다. (예. 학부: C_TS, 학과: C_TS01)')
        }
      }
    },
    checkCodeExists () {
      // 학과 학부 코드 중복 여부 확인
      if (this.mode === 'college') {
        this.$apollo.query({
          query: gql`${College}`,
          variables: {
            code: this.code
          }
        }).then(({ data: { college } }) => {
          if (college) {
            this.toggleInputValid('code', false, '이미 존재하는 코드입니다.')
          } else {
            this.toggleInputValid('code', true)
          }
        })
      } else if (this.mode === 'dpt') {
        this.$apollo.query({
          query: gql`${Department}`,
          variables: {
            code: this.code
          }
        }).then(({ data: { department } }) => {
          if (department) {
            this.toggleInputValid('code', false, '이미 존재하는 코드입니다.')
          } else {
            this.toggleInputValid('code', true)
          }
        })
      }
    },
    selectedType ({ code }) {
      this.mode = code
      if (code === 'college') {
        this.placeholder.code = '사용할 코드를 명명해주세요. 예) 학부: C_AX'
        this.placeholder.name = '이 코드는 어떤 곳을 의미하나요? 예) OO대학'
        this.maxLength = 4
      } else if (code === 'dpt') {
        this.placeholder.code = '사용할 코드를 명명해주세요. 예) 학과: C_AX01'
        this.placeholder.name = '이 코드는 어떤 곳을 의미하나요? 예) OO학과'
        this.maxLength = 6
      }
      this.toggleInputValid('mode', true)
    },
    selectedCollegeCd (value) {
      this.code = value
      this.form.college_cd = value
      this.toggleInputValid('dptParent', true)
    },
    validate () {
      let checkValidKeys
      if (this.mode) {
        this.toggleInputValid('mode', true)
        if (this.mode === 'college') {
          checkValidKeys = ['mode', 'code', 'name']
          this.validateName()
          this.validateCode()
        } else if (this.mode === 'dpt') {
          checkValidKeys = ['mode', 'code', 'name', 'dptParent']
          this.validateName()
          this.validateCode()
          this.validateDptParent()
        }
        this.validated = checkValidKeys.every(key => this.validation[key])
      } else {
        this.toggleInputValid('mode', false, '학부 / 학과 구분을 선택해주세요.')
        this.validated = false
      }
    },
    submit () {
      this.validate()
      if (this.validated) {
        if (this.mode === 'college') {
          this.form.college_cd = this.code
          this.form.college_nm = this.name
          delete this.form.dpt_nm
          delete this.form.dpt_cd
          this.$apollo.mutate({
            mutation: gql`${modCollege}`,
            variables: {
              mode: 'CREATE',
              options: {
                ...this.form
              }
            }
          }).then(({ data: { modCollege } }) => {
            if (modCollege) {
              this.$buefy.toast.open('코드를 생성하였습니다.')
              this.$router.push('/gate/manager/codes')
            }
          })
        } else if (this.mode === 'dpt') {
          this.form.dpt_cd = this.code
          this.form.dpt_nm = this.name
          delete this.form.college_nm
          this.$apollo.mutate({
            mutation: gql`${modDepartment}`,
            variables: {
              mode: 'CREATE',
              options: {
                ...this.form
              }
            }
          }).then(({ data: { modDepartment } }) => {
            if (modDepartment) {
              this.$buefy.toast.open('코드를 생성하였습니다.')
              this.$router.push('/gate/manager/codes')
            }
          })
        }
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '작성하지 않거나 잘못된 입력 항목이 있습니다.',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          ariaRole: 'alertdialog',
          ariaModal: true,
          confirmText: '확인'
        })
      }
    }
  }
}
</script>
