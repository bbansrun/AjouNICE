<template>
    <div class="wrapper">
        <Landing :title="title" :description="`${category} - ${sub_category}`" background="https://faculty.ajou.ac.kr/_resources/faculty/img/main_visual02.jpg" />
        <div class="container">
            <form @submit.prevent data-post-form>
                <div class="input-form">
                    <label for="category">게시판명</label>
                    <!-- <v-select /> -->
                </div>
                <div class="input-form">
                    <label for="title">제목</label>
                    <input type="text" name="title" id="title" v-model="form.title" placeholder="제목을 입력하세요" required />
                </div>
                <div class="input-form editor">
                    <label for="textarea">내용</label>
                    <ckeditor name="textarea" :editor="editor" v-model="form.editorData" :config="editorConfig"></ckeditor>
                </div>
                <div class="input-form uploads">
                    <label for="images">이미지 삽입</label>
                    <file-upload
                        :post-action="postAction"
                        :put-action="putAction"
                        :extensions="extensions"
                        :accept="accept"
                        :multiple="multiple"
                        :directory="directory"
                        :size="size || 0"
                        :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                        :headers="headers"
                        :data="data"
                        :drop="drop"
                        :drop-directory="dropDirectory"
                        :add-index="addIndex"
                        v-model="files"
                        @input-filter="inputFilter"
                        @input-file="inputFile"
                        ref="upload">
                            <font-awesome-icon icon="plus" />
                        </file-upload>
                </div>
                <div class="input-form controls">
                    <input type="button" :value="form.submitButton">
                    <input type="button" value="취소" @click="goBack()">
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
import FileUpload from 'vue-upload-component'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'

Vue.use(CKEditor)
export default {
    components: {
        Landing, Footer, FileUpload
    },
    data () {
        return {
            category: '',
            category_idx: null,
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
                content: '',
            },
            editFile: {
                show: false,
                name: '',
            }
        }
    },
    beforeMount () {
        let pParser = pathParser(this.$route.path)
        this.mode[pParser.name] = true
        if (this.mode.new) {
            this.title = '게시물 작성'
            this.form.submitButton = '작성'
        } else if (this.mode.edit) {
            this.title = '게시물 수정'
            this.form.submitButton = '수정'
        }
        let _this = this
        this.$apollo.query({
            query: gql`{ findBoardCategories(depth: 0, title: "${_this.$route.params.category}") { category_idx category_nm title access_auth private_yn desc } }`
        }).then(result => {
            _this.category = result.data.findBoardCategories[0].category_nm
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 1, title: "${_this.$route.params.name}", parent: ${_this.category_idx}) { category_idx category_nm title parent access_auth private_yn desc } }`
            }).then(result => {
                _this.sub_category = result.data.findBoardCategories[0].category_nm
            })
        })
    },
    methods: {
        goBack () {
            this.$router.go(-1)
        }
    }
}
</script>