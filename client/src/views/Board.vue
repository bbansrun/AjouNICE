<template>
    <div class="wrapper">
        <div class="container">
            <section v-if="$route.params.category">
                <header>{{ category }} | {{ sub_category }}</header>
                <ul v-for="category in sub_categories" :key="category.category_idx">
                    <li>
                        <router-link :to="'/board/' + $route.params.category + '/' + category.title">{{ category.category_nm }} | {{ category.desc }}</router-link>
                    </li>
                </ul>
                <table class="list">
                    <thead></thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            </section>
            <section v-else>
                <header>전체 게시판</header>
                <ul v-for="category in categories" :key="category.category_idx">
                    <li>
                        <router-link :to="'/board/' + category.title">{{ category.category_nm }} | {{ category.desc }}</router-link>
                    </li>
                </ul>
            </section>
        </div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import Footer from '@/components/Footer.vue'
export default {
    name: 'board',
    components: {
        Footer
    },
    data () {
        return {
            categories: null,
            sub_categories: null,
            category: '',
            category_idx: null,
            sub_category: '',
            sub_category_idx: null
        }
    },
    methods: {},
    beforeCreate () {
        document.body.classList.toggle('loading')
    },
    beforeMount () {
        let _this = this
        if (this.$route.params.category) {
            this.$apollo.query({
                query: gql`{ findBoardCategories(depth: 0, title: "${_this.$route.params.category}") { category_idx category_nm title access_auth private_yn desc } }`
            }).then(result => {
                _this.category = result.data.findBoardCategories[0].category_nm
                _this.category_idx = result.data.findBoardCategories[0].category_idx
            })
            if (this.$route.params.name) {
                this.$apollo.query({
                    query: gql`{ findBoardCategories(depth: 1, title: "${_this.$route.params.name}", parent: ${_this.category_idx}) { category_idx category_nm title parent access_auth private_yn desc } }`
                }).then(result => {
                    console.log(result.data)
                    _this.sub_category = result.data.findBoardCategories[0].category_nm
                    _this.sub_category_idx = result.data.findBoardCategories[0].category_idx
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
    } 
}
</script>

<style lang="scss">

</style>