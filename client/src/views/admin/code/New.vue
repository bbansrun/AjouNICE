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
              일치하는 옵션이 없어요.
            </template>
          </v-select>
          <p
            v-show="validation.mode === false"
            class="auto-validate-noti"
            :class="{'error': validation.mode === false }"
          >
            구분을 선택하지 않았습니다.
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
            소속대학을 선택하지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="code">코드</label>
        <div class="input-form-wrapper">
          <input
            id="code"
            v-model="form.code"
            type="text"
            name="code"
            autocapitalize="on"
            no-validate
            :class="{'error': validation.code === false }"
            :placeholder="placeholder.code"
            :maxlength="maxLength"
          >
          <p
            v-show="validation.code === false"
            class="auto-validate-noti"
            :class="{'error': validation.code === false }"
          >
            <span v-if="mode === 'college'">코드명은 학과 특징을 드러내는 영문와 _으로 이루어진 4자리로 구성되어야합니다.</span>
            <span v-if="mode === 'dpt'">코드명은 학과코드와 일련번호(숫자)를 포함한 6자리로 구성되어야합니다. {{ form.college_cd ? ` (학과코드: ${form.college_cd})` : '' }}</span>
            <span v-else>구분 선택 후 코드를 입력하시기 바랍니다.</span>
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="name">명칭</label>
        <div class="input-form-wrapper">
          <input
            id="name"
            v-model="form.name"
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
            명칭을 입력해주세요.
          </p>
        </div>
      </div>
      <div class="input-form-group">
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
import { AllColleges } from '@/assets/graphql/queries'
import { createCollege, createDepartment } from '@/assets/graphql/mutations'
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
      maxLength: 6,
      form: {
        college_cd: '',
        exist_yn: 'Y',
        code: '',
        name: '',
        reg_ip: '',
        upt_ip: ''
      },
      validation: {
        mode: null,
        code: null,
        name: null,
        dptParent: null
      },
      validated: false
    }
  },
  watch: {
    'form.name' (value) {
      this.validateInput('name')
    },
    'form.code' (value) {
      // Custom Validation
      if (value) {
        if (value.includes(this.form.college_cd)) {
          if (value.length === this.maxLength) {
            this.validation.code = true
          } else {
            this.validation.code = false
          }
        } else {
          this.validation.code = false
        }
      } else {
        this.validation.code = false
      }
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
  mounted () {
    this.form.reg_ip = this.$store.state.user.access_loc
    this.form.upt_ip = this.$store.state.user.access_loc
  },
  methods: {
    validateInput (key, compare = null) {
      // Form Data가 적절한 조건 만족하였는지 판단
      // compare의 경우 object type data를 받을 경우,
      // 비교값인 value와 일치/불일치 비교 여부 checkIsCorrect (Boolean)를 전달하여야함
      if (compare) {
        if (Object.prototype.hasOwnProperty.call(compare, 'value') &&
            Object.prototype.hasOwnProperty.call(compare, 'checkIsCorrect')) {
          if (compare.checkIsCorrect) {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] === item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          } else {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] !== item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (this.form[key]) {
          this.validation[key] = true
        } else {
          this.validation[key] = false
        }
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
      this.validation.mode = true
    },
    selectedCollegeCd (value) {
      this.form.college_cd = value
      this.form.code = value
      this.validation.dptParent = true
    },
    validate () {
      this.validateInput('code')
      this.validateInput('name')
      if (this.mode) {
        this.validation.mode = true
        if (this.mode === 'dpt') {
          if (this.form.college_cd) {
            this.validation.dptParent = true
          } else {
            this.validation.dptParent = false
          }
        }
      } else {
        this.validation.mode = false
      }
      if (this.mode) {
        if (this.mode === 'college') {
          if (this.form.code && this.form.name) {
            this.validated = true
          }
        } else if (this.mode === 'dpt') {
          if (this.form.code && this.form.name && this.form.college_cd) {
            this.validated = true
          }
        }
      }
    },
    submit () {
      this.validate()
      if (this.validated) {
        if (this.mode === 'college') {
          this.$apollo.mutate({
            mutation: gql`${createCollege}`,
            variables: {
              ...this.form
            }
          }).then(({ data: { createCollege } }) => {
            if (createCollege) {
              this.$buefy.toast.open('코드를 생성하였습니다.')
              this.$router.push('/gate/manager/codes')
            }
          })
        } else if (this.mode === 'dpt') {
          this.$apollo.mutate({
            mutation: gql`${createDepartment}`,
            variables: {
              ...this.form
            }
          }).then(({ data: { createDepartment } }) => {
            if (createDepartment) {
              this.$buefy.toast.open('코드를 생성하였습니다.')
              this.$router.push('/gate/manager/codes')
            }
          })
        }
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '작성하지 않은 항목이 있습니다.',
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

<style>

</style>
