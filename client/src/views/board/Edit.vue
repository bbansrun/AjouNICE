<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>게시물 수정</strong>
        </header>
        <form
          data-post-form
          autocomplete="off"
          @submit.prevent
        >
          <div class="content-wrapper">
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
            <div class="input-form-controls buttons">
              <b-button
                size="is-small"
                type="is-info"
                @click="editPost()"
              >
                <font-awesome-icon icon="pen" />&nbsp;
                <span>수정</span>
              </b-button>
              <b-button
                size="is-small"
                type="is-danger"
                @click="goBack()"
              >
                <font-awesome-icon icon="times" />&nbsp;
                <span>취소</span>
              </b-button>
            </div>
          </div>
        </form>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'

import { Navigation, Footer } from '@/components'
import { Post, SubCates, AllCates, CateInfo } from '@/assets/graphql/queries'
import { editPost } from '@/assets/graphql/mutations'

import { ClassicEditor, editorConfig } from '@/vendor/ckeditor/DefaultImportSet'

export default {
  components: {
    Navigation,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      category: '',
      category_idx: null,
      sub_category: '',
      sub_category_idx: null,
      editor: ClassicEditor,
      editorConfig,
      title: '',
      form: {
        post: {},
        title: '',
        editorData: '<p></p>'
      }
    }
  },
  computed: {
    landingDescription () {
      return this.form.title
    }
  },
  beforeMount () {
    document.body.classList.toggle('loading')
    this.title = '게시물 수정'
    this.$apollo.query({
      query: gql`${Post}`,
      variables: {
        id: this.$route.params.post_id
      }
    }).then(({ data }) => {
      this.form.post = data.post
      this.form.title = data.post.title
      this.form.editorData = data.post.body
      document.body.classList.toggle('loading')
    })
  },
  methods: {
    editPost () {
      const user = this.$store.state.user
      document.body.classList.toggle('loading')
      this.$apollo.mutate({
        mutation: gql`${editPost}`,
        variables: {
          board_idx: parseInt(this.$route.params.post_id),
          category_idx: parseInt(this.form.post.category.category_idx),
          user_idx: user.idx,
          title: this.form.title,
          body: this.form.editorData,
          upt_ip: user.access_loc,
          upt_dt: Date.now()
        }
      }).then(({ data }) => {
        document.body.classList.toggle('loading')
        this.$swal({
          type: 'success',
          title: '게시!',
          text: '게시물이 수정되었습니다.'
        }).then(() => {
          let url = this.$route.path
          url = url.split('/')
          url.pop()
          this.$router.push(urljoin(url.join('/'), 'view'))
        })
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-select {
    margin-bottom: 5px;
}
</style>
