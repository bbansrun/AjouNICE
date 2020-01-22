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
            <PostList :items="posts" />
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
            write_url: urljoin(this.$route.path, '/new'),
            posts: []
        }
    },
    methods: {
        getAllCategories (options) {
            if (options && options.parent) {
                this.$apollo.query({
                    query: gql`{ findBoardCategories(depth: 1, parent: ${options.parent}) { category_nm title desc access_auth private_yn } }`
                }).then(({ data }) => {
                    this.sub_categories = data.findBoardCategories
                })
            } else {
                this.$apollo.query({
                    query: gql`{ findBoardCategories(depth: 0) { category_nm title desc access_auth private_yn } }`
                }).then(({ data }) => {
                    this.categories = data.findBoardCategories
                })
            }
        },
        getCateInfo (name) {
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 0, title: "${name}") { category_idx category_nm title access_auth private_yn desc } }`
            }).then(({ data }) => {
                this.category = data.findBoardCategories[0].category_nm
                this.category_desc = data.findBoardCategories[0].desc
                this.category_idx = data.findBoardCategories[0].category_idx
                this.getAllCategories({ parent: this.category_idx })
            })
        },
        getSubCateInfo (parent, name) {
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 1, title: "${name}", parent: ${parent}) { category_idx category_nm title parent access_auth private_yn desc } }`
            }).then(({ data }) => {
                this.sub_category = data.findBoardCategories[0].category_nm
                this.sub_category_desc = data.findBoardCategories[0].desc
                this.sub_category_idx = data.findBoardCategories[0].category_idx
                this.getPosts(1, this.sub_category_idx)
            })
        },
        getPosts (depth, category_idx) {
            this.$apollo.query({
                query: gql`{ findBoardsByBoardCategories(depth: ${depth}, category_idx: ${category_idx}) { category_idx board_idx user_idx nick_nm title } }`
            }).then(({ data }) => {
                this.posts = data.findBoardsByBoardCategories
            })
        }
    },
    beforeCreate () {
        document.body.classList.toggle('loading')
    },
    beforeMount () {
        if (this.$route.params.category) {
            // 특정 Depth 카테고리 내 전체 게시물 조회
            this.getCateInfo(this.$route.params.category)
            if (this.$route.params.name) {
                // 특정 Depth 하위 카테고리 내 전체 게시물 조회
                this.getSubCateInfo(this.category_idx, this.$route.params.name)
            } else {

            }
        } else {
            // 전체 게시판 조회
            this.getAllCategories()
            // 전체 게시판 게시물 조회
            // 미구현
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