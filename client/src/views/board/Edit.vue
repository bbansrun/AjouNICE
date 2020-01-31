<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      :description="`${category} - ${sub_category}`"
      background="https://faculty.ajou.ac.kr/_resources/faculty/img/main_visual02.jpg"
    />
    <div class="container">
      <form
        data-post-form
        autocomplete="off"
        @submit.prevent
      >
        <div
          v-if="mode.new"
          class="input-form"
        >
          <label for="category">게시판명</label>
          <div class="input-form-group">
            <v-select
              v-model="selectedCategory"
              placeholder="게시판 분류 선택"
              :value="selectedCategory"
              :options="categories"
              :reduce="options => options.category_idx"
              label="category_nm"
              @input="getCateDepth1()"
            />
            <v-select
              v-if="sub_categories"
              v-model="selectedSubCategory"
              placeholder="게시판 하위 분류 선택"
              :value="selectedSubCategory"
              :options="sub_categories"
              :reduce="options => options.category_idx"
              label="category_nm"
            />
          </div>
        </div>
        <div class="input-form">
          <label for="title">제목</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            required
          >
        </div>
        <div class="input-form editor">
          <label for="textarea">내용</label>
          <ckeditor
            v-model="form.editorData"
            name="textarea"
            :editor="editor"
            :config="editorConfig"
          />
        </div>
        <div class="input-form uploads">
          <label for="images">이미지 삽입</label>
          <FileUpload />
        </div>
        <div class="input-form-controls">
          <input
            type="button"
            class="btn box-shadow text-inverse btn-submit"
            :value="form.submitButton"
            @click="writePost"
          >
          <input
            type="button"
            class="btn box-shadow text-inverse btn-cancel"
            value="취소"
            @click="goBack()"
          >
        </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import pathParser from 'path-parse'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import FileUpload from '@/components/FileUpload.vue'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'

Vue.use(CKEditor)
export default {
  components: {
    Navigation, Landing, Footer, FileUpload
  },
  data () {
    return {
      scrollBase: null,
      selectedCategory: '',
      selectedSubCategory: '',
      selectedCategoryTitle: '',
      selectedSubCategoryTitle: '',
      categories: [],
      category: '',
      category_idx: null,
      sub_categories: [],
      sub_category: '',
      sub_category_idx: null,
      editor: ClassicEditor,
      editorConfig: {
        toolbar: []
      },
      mode: {
        new: false,
        edit: false
      },
      title: '',
      form: {
        title: '',
        editorData: '<p></p>',
        submitButton: ''
      },
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      postAction: '/upload/post',
      putAction: '/upload/put',
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: '',
        type: '',
        content: ''
      },
      editFile: {
        show: false,
        name: ''
      }
    }
  },
  watch: {
    selectedCategory (value) {
      if (value) {
        this.selectedCategoryTitle = this.categories.filter((elem) => elem.category_idx === value)[0].title
      }
    },
    selectedSubCategory (value) {
      if (value) {
        this.selectedSubCategoryTitle = this.sub_categories.filter((elem) => elem.category_idx === value)[0].title
      }
    }
  },
  beforeMount () {
    const pParser = pathParser(this.$route.path)
    this.mode[pParser.name] = true
    if (this.mode.new) {
      this.title = '게시물 작성'
      this.form.submitButton = '작성'
    } else if (this.mode.edit) {
      this.title = '게시물 수정'
      this.form.submitButton = '수정'
    }
    const _this = this
    if (!this.$route.params.category) {
      this.$apollo.query({
        query: gql`{ findBoardCategories(depth: 0) { category_idx category_nm title access_auth private_yn desc } }`
      }).then(result => {
        _this.categories = result.data.findBoardCategories.filter((elem) => (elem.access_auth === 'ALL' && elem.private_yn === 'N'))
      }).catch(error => {
        console.error(error)
      })
    } else {
      this.$apollo.query({
        query: gql`{ findBoardCategories(depth: 0, title: "${_this.$route.params.category}") { category_idx category_nm title access_auth private_yn desc } }`
      }).then(result => {
        _this.category = result.data.findBoardCategories[0].category_nm
        _this.category_idx = result.data.findBoardCategories[0].category_idx
        this.$apollo.query({
          query: gql`{ findBoardCategories(depth: 1, title: "${_this.$route.params.name}", parent: ${_this.category_idx}) { category_idx category_nm title parent access_auth private_yn desc } }`
        }).then(result => {
          _this.sub_category = result.data.findBoardCategories[0].category_nm
          _this.sub_category_idx = result.data.findBoardCategories[0].category_idx
        })
      })
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    writePost () {
      const user = this.$store.state.user
      if (this.selectedCategory && this.selectedSubCategory && this.form.title && this.form.editorData) {
        this.$apollo.mutate({
          mutation: gql`mutation { writeBoard(category_idx: ${this.selectedSubCategory}, user_idx: ${user.idx}, nick_nm: "${user.nick_nm}", title: "${this.form.title}", body: "${this.form.editorData}", reg_ip: "${user.access_loc}") { board_idx } }`
        }).then(({ data }) => {
          // Flash
          this.$swal({
            type: 'success',
            title: '게시!',
            text: '게시되었습니다.',
            width: '90vw',
            allowOutsideClick: false
          }).then(() => {
            window.location = `/board/${this.selectedCategoryTitle}/${this.selectedSubCategoryTitle}/${data.writeBoard.board_idx}/view`
          })
        })
      } else {
        this.$swal({
          title: '잠깐!',
          text: '작성하지 않은 항목이 있습니다.',
          type: 'error',
          footer: '<p>누락된 항목을 확인하신 후 다시 시도하여주시기 바랍니다.</p>',
          width: '90vw'
        })
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    getCateDepth1 () {
      this.sub_categories = []
      this.selectedSubCategory = ''
      const _this = this
      this.$apollo.query({
        query: gql`{ findBoardCategories(depth: 1, parent: ${_this.selectedCategory}) { category_idx category_nm title parent access_auth private_yn desc } }`
      }).then(result => {
        _this.sub_categories = result.data.findBoardCategories.filter((elem) => (elem.access_auth === 'ALL' && elem.private_yn === 'N'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-select {
    margin-bottom: 5px;
}
</style>
