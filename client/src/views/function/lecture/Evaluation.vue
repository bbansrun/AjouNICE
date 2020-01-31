<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" title="강의평가" description="여러분의 수강후기를 공유해주세요." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg" />
        <div class="container">
            <section class="evaluate">
                <article>
                    <header class="underline underline-inline-block">강의평 작성</header>
                </article>
                <form @submit.prevent data-post-form autocomplete="off">
                    <div class="input-form editor">
                        <model-select :options="options"
                            v-model="item"
                            placeholder="학과명, 과목명, 혹은 교수명을 입력하시거나 리스트에서 선택해주세요.">
                        </model-select>
                    </div>
                    <div class="input-form editor">
                        <label for="textarea">강의평 내용</label>
                        <ckeditor name="textarea" :editor="editor" v-model="form.editorData" :config="editorConfig"></ckeditor>
                    </div>
                    <div class="input-form-controls">
                        <input type="button" class="btn box-shadow text-inverse btn-submit" :value="form.submitButton" @click="evaluate">
                        <input type="button" class="btn box-shadow text-inverse btn-cancel" value="취소" @click="goBack()">
                    </div>
                </form>
            </section>
        </div>
        <Footer />
    </div>
</template>

<script>
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'

export default {
 components: {
     Navigation, Landing, Footer, ModelSelect
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
        },
     }
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
    },
},
 mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
 }
}
</script>