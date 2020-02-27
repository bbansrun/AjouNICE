<template>
  <section class="codes">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 코드 작성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="type">학부/학과 구분</label>
        <v-select
          placeholder="학부/학과 여부를 선택해주세요."
          :options="options"
          @input="onSelected"
        >
          <template v-slot:no-options>
            일치하는 옵션이 없어요.
          </template>
        </v-select>
      </div>
      <div
        v-show="mode === 'dpt'"
        class="input-form-group"
      >
        <label for="college">소속 학부</label>
        <v-select
          placeholder="소속대학을 선택해주세요."
        >
          <template v-slot:no-options>
            일치하는 옵션이 없어요.
          </template>
        </v-select>
      </div>
      <div class="input-form-group">
        <label for="code">코드</label>
        <input
          id="code"
          v-model="form.code"
          type="text"
          name="code"
          no-validate
          :placeholder="placeholder.code"
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
          :placeholder="placeholder.name"
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
          <span>작성</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { AllColleges } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      mode: '',
      options: [
        { label: '학부', code: 'college' },
        { label: '학과', code: 'dpt' }
      ],
      placeholder: {
        code: '사용할 코드를 명명해주세요. 예) 학부: C_AX, 학과: C_AX01',
        name: '이 코드는 어떤 곳을 의미하나요? 예) OO학과, OO대학'
      },
      maxLength: 20,
      form: {
        code: '',
        name: ''
      }
    }
  },
  watch: {
    mode (code) {
      if (code === 'dpt') {
        this.$apollo.query({
          query: gql`${AllColleges}`
        }).then(({ data: { allColleges } }) => {
          console.log(allColleges)
        })
      }
    }
  },
  methods: {
    onSelected ({ code }) {
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
    },
    submit () {

    }
  }
}
</script>

<style>

</style>
