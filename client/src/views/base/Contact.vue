<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" title="광고/제휴/기타문의" description="개발팀에 궁금한 것이 있으시면 연락주시기 바랍니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual01.jpg" />
        <div class="container">
            <article>
                <header class="underline underline-inline-block">문의폼 작성</header>
                <section>
                    <form data-post-form>
                        <div class="input-form-wrapper">
                            <div class="input-form">
                                <label for="name">이름</label>
                                <input type="text" v-model="name" name="name" id="name" placeholder="이름을 입력해주세요" required pattern=".{1,}" />
                            </div>
                            <div class="input-form">
                                <label for="email">이메일</label>
                                <input type="email" v-model="email" name="email" id="email" placeholder="이메일 주소를 입력해주세요" required />
                            </div>
                            <div class="input-form">
                                <label for="textarea">내용</label>
                                <ckeditor name="textarea" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                            </div>
                            <div class="input-form">
                                <input type="button" class="btn" value="이메일 발송">
                            </div>
                        </div>
                    </form>
                </section>
            </article>
        </div>
        <Footer />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
export default {
    name: 'contact',
    components: {
        Navigation, Landing, Footer
    },
    data () {
        return {
            scrollBase: null,
            name: '',
            email: '',
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                toolbar: []
            },
        }
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    }
}
</script>

<style lang="scss">

article {
    margin-top: 2rem !important;
    padding: 0 2rem !important;
    & header {
        font-weight: bold;
        font-size: 1.5rem;
        & span {
            position: relative;
            &::before {
                content: "";
                display: block;
                position: absolute;
                left: 0;
                z-index: -1;
                bottom: 1px;
                height: 10px;
                background-color: #667eea;
                transition: all .4s cubic-bezier(0.57, 0.02, 0.06, 1);
                width: 100%;
            }
        }
    }
}
</style>