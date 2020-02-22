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
import Vue from 'vue'
import gql from 'graphql-tag'
import urljoin from 'url-join'
import pathParser from 'path-parse'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import List from '@ckeditor/ckeditor5-list/src/list'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import { Navigation, Footer } from '@/components'
import { Post, SubCates, AllCates, CateInfo } from '@/assets/graphql/queries'
import { editPost, singleUpload } from '@/assets/graphql/mutations'

class ImageUploadToS3Adapter {
  constructor (loader) {
    this.loader = loader
  }

  upload () {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        Vue.prototype.$Apollo.mutate({
          mutation: gql`${singleUpload}`,
          variables: {
            file: file,
            type: "board"
          }
        }).then(({ data: { singleUpload } }) => {
          console.log(singleUpload)
          resolve({ default: singleUpload })
        }).catch(error => {
          reject(error)
        })
      }))
  }
}

const ImageUploadToS3AdapterPlugin = (editor) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new ImageUploadToS3Adapter(loader)
  }
}

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
      editorConfig: {
        language: 'ko',
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          Heading,
          Alignment,
          BlockQuote,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageUpload,
          ImageUploadToS3AdapterPlugin,
          Table,
          TableToolbar,
          List
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'alignment',
            'bulletedList',
            'numberedList',
            'blockquote',
            '|',
            'insertTable',
            'mergeTableCells',
            'tableColumn',
            'tableRow',
            '|',
            'imageUpload'
          ]
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
          ]
        },
        image: {
          toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageTextAlternative'
          ]
        },
        simpleUpload: {
          uploadUrl: `http://${require('ip').address()}:455/graphql`
        }
      },
      title: '',
      form: {
        post: {},
        title: '',
        editorData: '<p></p>',
      },
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
          text: '게시물이 수정되었습니다.',
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
