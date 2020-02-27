<template>
  <section class="notice">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 공지사항 작성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="title">제목</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          name="title"
          no-validate
          placeholder="제목을 입력하세요"
        >
      </div>
      <div class="input-form-group">
        <label for="content">내용</label>
        <ckeditor
          v-model="form.content"
          name="textarea"
          :editor="editor"
          :config="editorConfig"
        />
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          expanded
          @click="submit"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 공지사항 등록</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
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

class ImageUploadToS3Adapter {
  constructor (loader) {
    this.loader = loader
  }

  upload () {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        Vue.prototype.$Apollo.mutate({
          mutation: gql`mutation { something {} }`,
          variables: {
            file: file,
            type: 'board'
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
  data () {
    return {
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
      form: {
        title: '',
        content: '<p></p>'
      }
    }
  },
  methods: {
    submit () {
      alert('등록!')
    }
  }
}
</script>

<style>

</style>
