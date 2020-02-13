<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      :description="landingDescription"
      background="https://faculty.ajou.ac.kr/_resources/faculty/img/main_visual02.jpg"
    />
    <div class="container">
      <form
        data-post-form
        autocomplete="off"
        @submit.prevent
      >
        <div class="content-wrapper">
          <div
            v-show="mode.new"
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
                :disabled="depth1Deactivated"
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
              @click="mode.new ? writePost() : editPost()"
            >
            <input
              type="button"
              class="btn box-shadow text-inverse btn-cancel"
              value="취소"
              @click="goBack()"
            >
          </div>
        </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import urljoin from 'url-join'
import pathParser from 'path-parse'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import FileUpload from '@/components/board/FileUpload.vue'
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'
import { Post, SubCates, AllCates, CateInfo } from '@/assets/graphql/queries'
import { writePost, editPost } from '@/assets/graphql/mutations'

Vue.use(CKEditor)
export default {
  components: {
    Navigation, Landing, Footer, FileUpload
  },
  data () {
    return {
      depth1Deactivated: true,
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
  computed: {
    landingDescription () {
      return this.mode.edit ? this.form.title : `${this.category} - ${this.sub_category}`
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
    this.mode[pathParser(this.$route.path).name] = true
    if (this.mode.new) {
      this.title = '게시물 작성'
      this.form.submitButton = '작성'
      if (!this.$route.params.category) {
        this.$apollo.query({
          query: gql`${AllCates}`,
          variables: {
            depth: 0
          }
        }).then(({ data }) => {
          this.categories = data.boards
        }).catch(error => {
          console.error(error)
        })
      } else {
        this.$apollo.query({
          query: gql`${CateInfo}`,
          variables: {
            title: this.$route.params.category
          }
        }).then(({ data }) => {
          this.categories.push(data.boards[0].category_nm)
          this.selectedCategory = data.boards[0].category_idx
          this.category_idx = data.boards[0].category_idx
          this.selectedCategoryTitle = data.boards[0].category_nm
          this.category = data.boards[0].category_nm
          this.getCateDepth1()
        })
      }
    } else if (this.mode.edit) {
      document.body.classList.toggle('loading')
      this.title = '게시물 수정'
      this.form.submitButton = '수정'
      this.$apollo.query({
        query: gql`${Post}`,
        variables: {
          id: this.$route.params.post_id
        }
      }).then(({ data }) => {
        this.form.title = data.post.title
        this.form.editorData = data.post.body
        document.body.classList.toggle('loading')
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
        document.body.classList.toggle('loading')
        this.$apollo.mutate({
          mutation: gql`${writePost}`,
          variables: {
            category_idx: parseInt(this.selectedSubCategory),
            user_idx: user.idx,
            nick_nm: user.nick_nm,
            title: this.form.title,
            body: this.form.editorData,
            reg_ip: user.access_loc
          }
        }).then(({ data: { writePost: { board_idx } } }) => {
          document.body.classList.toggle('loading')
          this.flash('게시되었습니다.', 'success')
          this.$router.push(`/board/${board_idx}/view`)
        })
      } else {
        this.$swal({
          title: '잠깐!',
          text: '작성하지 않은 항목이 있습니다.',
          type: 'error',
          footer: '<p class=\'has-text-centered\'>누락된 항목을 확인하신 후 다시 시도하여주시기 바랍니다.</p>',
          width: '90vw',
          confirmButtonText: '확인'
        })
      }
    },
    editPost () {
      const user = this.$store.state.user
      this.$apollo.query({
        query: gql`${CateInfo}`,
        variables: {
          title: this.$route.params.category
        }
      }).then(({ data }) => {
        const cateId = data.boards[0].category_idx
        document.body.classList.toggle('loading')
        this.$apollo.mutate({
          mutation: gql`${editPost}`,
          variables: {
            board_idx: parseInt(this.$route.params.post_id),
            category_idx: parseInt(cateId),
            user_idx: user.idx,
            nick_nm: user.nick_nm,
            title: this.form.title,
            body: this.form.editorData,
            reg_ip: user.access_loc
          }
        }).then(({ data }) => {
          document.body.classList.toggle('loading')
          this.$swal({
            type: 'success',
            title: '게시!',
            text: '게시물이 수정되었습니다.',
            width: '90vw',
            allowOutsideClick: false
          }).then(() => {
            let url = this.$route.path
            url = url.split('/')
            url.pop()
            this.$router.push(urljoin(url.join('/'), 'view'))
          })
        })
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    getCateDepth1 () {
      this.sub_categories = []
      this.selectedSubCategory = ''
      this.$apollo.query({
        query: gql`${SubCates}`,
        variables: {
          depth: 1,
          parent: parseInt(this.selectedCategory)
        }
      }).then(({ data }) => {
        this.sub_categories = data.boards
        this.depth1Deactivated = false
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
