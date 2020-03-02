<template>
  <section class="codes">
    <header class="underline underline-inline-block underline-animated">
      <strong>코드 편집</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="type">학부/학과 구분</label>
        <div class="input-form-wrapper">
          <p>선택하신 레코드는 <strong>{{ type }}</strong>입니다.</p>
          <b-notification
            type="is-info"
            has-icon
            aria-close-label="닫기"
          >
            학부 / 학과가 서로 다른 테이블을 사용하고 있어 상호 변경이 불가능합니다.<br>상호 변경을 하실 경우, 레코드를 삭제하시고 새로 생성하시기 바랍니다.
          </b-notification>
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
            no-validate
            :maxlength="maxLength"
            placeholder="코드를 입력해주세요."
            :class="{'error': validation.code === false}"
          >
          <p
            v-show="validation.code === false"
            class="auto-validate-noti"
            :class="{'error': validation.code === false}"
          >
            <span v-if="typeDef === 'college'">코드명은 학과 특징을 드러내는 영문와 _으로 이루어진 4자리로 구성되어야합니다.</span>
            <span v-if="typeDef === 'dpt'">코드명은 학과코드와 일련번호(숫자)를 포함한 6자리로 구성되어야합니다. {{ form.college_cd ? ` (학과코드: ${college_cd})` : '' }}</span>
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
            placeholder="명칭을 입력해주세요."
            :class="{'error': validation.name === false}"
          >
          <p
            v-if="validation.name === false"
            class="auto-validate-noti"
            :class="{'error': validation.name === false}"
          >
            명칭 값이 입력되지 않았습니다.
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
          <span>수정</span>
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
import { College, AllColleges, Department } from '@/assets/graphql/queries'
import { modCollege, modDepartment } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      private_yn_label: '공개',
      mode: '',
      type: '',
      typeDef: '',
      college_cd: '',
      maxLength: 6,
      form: {
        exist_yn: 'Y',
        code: '',
        name: ''
      },
      validation: {
        code: null,
        name: null
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
        if (this.typeDef === 'college') {
          if (value.length === this.maxLength) {
            this.validation.code = true
          } else {
            this.validation.code = false
          }
        } else if (this.typeDef === 'dpt') {
          if (value.includes(this.college_cd)) {
            if (value.length === this.maxLength) {
              this.validation.code = true
            } else {
              this.validation.code = false
            }
          } else {
            this.validation.code = false
          }
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
    }
  },
  beforeMount () {
    try {
      const [type, value] = atob(this.$route.params.record).split('|')
      if (type === 'college') {
        this.type = '대학(학부)'
        this.maxLength = 4
      } else if (type === 'dpt') {
        this.type = '학과'
        this.maxLength = 6
      }
      this.typeDef = type
      this.form.code = value
      this.$apollo.query({
        query: gql`${type === 'college' ? College : type === 'dpt' ? Department : {}}`,
        variables: {
          code: value
        }
      }).then(({ data }) => {
        if (type === 'college') {
          if (data.college) {
            this.college_cd = data.college.college_cd
            this.form.name = data.college.college_nm
          } else {
            throw Error('유효하지 않은 레코드입니다.')
          }
        } else if (type === 'dpt') {
          if (data.department) {
            this.form.name = data.department.dpt_nm
            this.college_cd = data.department.college_cd
          } else {
            throw Error('유효하지 않은 레코드입니다.')
          }
        }
      }).catch(error => {
        console.error(error)
        this.$router.push('/error/404')
      })
    } catch (e) {
      console.error('유효하지 않은 레코드입니다.')
      this.$router.push('/error/404')
    }
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
    validate () {
      this.validateInput('code')
      this.validateInput('name')
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    submit () {
      this.validate()
      if (this.validated) {
        this.$buefy.dialog.confirm({
          title: '코드 변경',
          message: '변경하시겠습니까? <strong>코드 변경으로 인한 서비스에 지대한 영향을 미치게 됩니다.</strong> 그럼에도 진행하시려면 <strong>진행</strong>을 눌러주세요.',
          confirmText: '진행',
          cancelText: '취소',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            this.$buefy.toast.open('코드 변경 작업을 진행합니다.')
            this.$apollo.mutate({
              mutation: gql`${this.typeDef === 'college' ? modCollege : this.typeDef === modDepartment ? modDepartment : {}}`,
              variables: {
                ...this.form
              }
            }).then(({ data }) => {
              console.log(data)
              this.$buefy.toast.open('코드 정보를 변경하였습니다.')
              this.$router.push('/gate/manager/codes')
            }).catch(error => {
              console.error(error)
            })
          }
        })
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
