<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" :title="boardTitle" :description="boardDescription" background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif" />
        <BoardNav :writeUrl="write_url" />
        <section v-if="$route.params.category">
            <ul class="board-nav" v-if="sub_categories">
                <li class="active">
                    <a href="#">전체</a>
                </li>
                <li v-for="category in sub_categories" :key="category.category_idx">
                    <a :href="'/board/' + $route.params.category + '/' + category.title">{{ category.category_nm }}</a>
                </li>
            </ul>
            <table class="list">
                <thead></thead>
                <tbody></tbody>
                <tfoot></tfoot>
            </table>
        </section>
        <section v-else>
            <ul class="board-nav" v-if="categories">
                <li class="active">
                    <a href="#">전체</a>
                </li>
                <li v-for="category in categories" :key="category.category_idx">
                    <a :href="'/board/' + category.title">{{ category.category_nm }}</a>
                </li>
            </ul>
        </section>
        <div class="container">
            <PostList items="" />
        </div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import urljoin from 'url-join'
import Landing from '@/components/Landing.vue'
import Navigation from '@/components/Navigation.vue'
import PostList from '@/components/PostList.vue'
import BoardNav from '@/components/BoardNav.vue'
import Footer from '@/components/Footer.vue'
export default {
    name: 'board',
    components: {
        Landing, Navigation, PostList, BoardNav, Footer
    },
    data () {
        return {
            scrollBase: null,
            categories: null,
            sub_categories: null,
            category: '',
            category_desc: '',
            category_idx: null,
            sub_category: '',
            sub_category_desc: '',
            sub_category_idx: null,
            write_url: '',
        }
    },
    methods: {},
    beforeCreate () {
        document.body.classList.toggle('loading')
    },
    beforeMount () {
        this.write_url = urljoin(this.$route.path, '/new')
        let _this = this
        if (this.$route.params.category) {
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 0, title: "${_this.$route.params.category}") { category_idx category_nm title access_auth private_yn desc } }`
            }).then(result => {
                _this.category = result.data.findBoardCategories[0].category_nm
                _this.category_desc = result.data.findBoardCategories[0].desc
                _this.category_idx = result.data.findBoardCategories[0].category_idx
            })
            if (this.$route.params.name) {
                this.$apollo.query({
                    query: gql`{ findBoardCategories(depth: 1, title: "${_this.$route.params.name}", parent: ${_this.category_idx}) { category_idx category_nm title parent access_auth private_yn desc } }`
                }).then(result => {
                    if (result.data.findBoardCategories.length === 0) {
                        window.location = '/error/404'
                    } else {
                        _this.sub_category = result.data.findBoardCategories[0].category_nm
                        _this.sub_category_desc = result.data.findBoardCategories[0].desc
                        _this.sub_category_idx = result.data.findBoardCategories[0].category_idx
                    }
                })
            } else {
                this.$apollo.query({
                    query: gql`{ findBoardCategories(depth: 1, parent: ${_this.category_idx}) { category_idx category_nm title parent access_auth private_yn desc } }`
                }).then(result => {
                    _this.sub_categories = result.data.findBoardCategories.filter((elem) => (elem.access_auth === 'ALL' && elem.private_yn === 'N'))
                })
            }
        } else {
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 0) { category_idx category_nm title access_auth private_yn desc } }`
            }).then(result => {
                _this.categories = result.data.findBoardCategories.filter((elem) => (elem.access_auth === 'ALL' && elem.private_yn === 'N'))
            }).catch(error => {

            })
        }
    },
    created () {
        document.body.classList.toggle('loading')
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    },
    computed: {
        boardTitle () {
            if (!this.$route.params.category) {
                return '게시판'
            } else {
                if (!this.$route.params.name) {
                    return this.category
                } else {
                    return this.sub_category
                }
            }
        },
        boardDescription () {
            if (!this.$route.params.name) {
                return this.category_desc
            } else {
                return this.sub_category_desc
            }
        }
    }
}
</script>