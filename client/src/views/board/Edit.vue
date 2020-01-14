<template>
    <div class="wrapper">
        <Landing :title="title" :description="`${category} - ${sub_category}`" background="https://faculty.ajou.ac.kr/_resources/faculty/img/main_visual02.jpg" />
        <div class="container">
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import pathParser from 'path-parse'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    components: {
        Landing, Footer
    },
    data () {
        return {
            category: '',
            category_idx: null,
            sub_category: '',
            sub_category_idx: null,
            editor: ClassicEditor,
            editorData: '<p></p>',
            editorConfig: {
            },
            mode: {
                new: false,
                edit: false
            },
            title: ''
        }
    },
    beforeMount () {
        let pParser = pathParser(this.$route.path)
        this.mode[pParser.name] = true
        if (this.mode.new) {
            this.title = '게시물 작성'
        } else if (this.mode.edit) {
            this.title = '게시물 수정'
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
    }
}
</script>