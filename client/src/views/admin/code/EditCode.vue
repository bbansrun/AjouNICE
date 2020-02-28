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
          <span>선택하신 레코드는 <strong>{{ type }}</strong>입니다.</span>
          <b-notification
            type="is-info"
            has-icon
            aria-close-label="닫기"
          >
            학부 / 학과가 서로 다른 테이블을 사용하고 있어 상호 변경이 불가능합니다. 상호 변경을 하실 경우, 레코드를 삭제하시고 새로 생성하시기 바랍니다.
          </b-notification>
        </div>
      </div>
      <div class="input-form-group">
        <label for="code">코드</label>
        <input
          id="code"
          v-model="form.code"
          type="text"
          name="code"
          no-validate
          :maxlength="maxLength"
        >
      </div>
      <div class="input-form-group">
        <label for="name">명칭</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          name="name"
          no-validate
        >
      </div>
      <div class="input-form-controls">
        <b-button
          type="is-primary"
          size="is-small"
          expanded
          @click="submit"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>수정</span>
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
      mode: '',
      type: '',
      typeDef: '',
      maxLength: 20,
      form: {
        code: '',
        name: ''
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
            this.form.name = data.college.college_nm
          } else {
            throw Error('유효하지 않은 레코드입니다.')
          }
        } else if (type === 'dpt') {
          if (data.department) {
            this.form.name = data.department.dpt_nm
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
    submit () {
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
          }).catch(error => {
            console.error(error)
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
