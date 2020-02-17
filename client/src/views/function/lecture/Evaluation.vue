<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="강의평가"
      description="여러분의 수강후기를 공유해주세요."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <main>
      <div class="wrapper">
        <section class="evaluate">
          <header class="underline underline-inline-block">
            <strong>강의평 작성</strong>
          </header>
          <form
            data-post-form
            autocomplete="off"
            @submit.prevent
          >
            <div class="input-form editor">
              <model-select
                v-model="item"
                :options="options"
                placeholder="학과명, 과목명, 혹은 교수명을 입력하시거나 리스트에서 선택해주세요."
              />
            </div>
            <div class="input-form editor">
              <label for="textarea">강의평 내용</label>
              <ckeditor
                v-model="form.editorData"
                name="textarea"
                :editor="editor"
                :config="editorConfig"
              />
            </div>
            <div class="input-form-controls buttons">
              <b-button
                type="is-primary"
                @click="evaluate"
              >
                <font-awesome-icon icon="pen" />&nbsp;
                <span>{{ form.submitButton }}</span>
              </b-button>
              <b-button
                type="is-danger"
                @click="goBack()"
              >
                <font-awesome-icon icon="times" />&nbsp;
                <span>취소</span>
              </b-button>
            </div>
          </form>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Navigation, Landing, Footer } from '@/components'
export default {
  components: {
    Navigation,
    Landing,
    Footer,
    ModelSelect
  },
  data () {
    return {
      scrollBase: null,
      options: [
        { value: '1', text: '사이버보안학과 | 현대암호이론및응용(예홍진)' },
        { value: '2', text: '소프트웨어학과 | 컴퓨터네트워크 (강경란)' },
        { value: '3', text: '소프트웨어학과 | 객체지향프로그래밍 (떼무)' },
        { value: '4', text: '소프트웨어학과 | 운영체제(고정길)' },
        { value: '5', text: '사이버보안학과 | 사이버보안사례특강(곽진)' }
      ],
      item: {
        value: '',
        text: ''
      },
      editor: ClassicEditor,
      editorConfig: {
        toolbar: []
      },
      form: {
        title: '',
        editorData: '<p></p>',
        submitButton: '강의평 작성'
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    evaluate () {
      // 강의평 등록
    },
    reset () {
      this.item = {}
    },
    selectFromParentComponent1 () {
      // select option from parent component
      this.item = this.options[0]
    }
  }
}
</script>
