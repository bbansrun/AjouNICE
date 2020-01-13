<template>
    <section>
        <header>{{ category }} | {{ sub_category }}</header>
        <table class="list">
            <thead></thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>
    </section>
</template>

<script>
import gql from 'graphql-tag'
export default {
    name: 'board',
    data () {
        return {
            category: '',
            sub_category: '',
            
        }
    },
    methods: {},
    beforeCreate () {
        document.body.classList.toggle('loading')
    },
    beforeMount () {
        if (this.$route.params.category) {
            this.$apollo.query({
                query: gql`{ fName(depth: 0) { depth parent category_nm title category_idx access_auth private_yn desc } }`
            }).then(result => {
                this.category = result.data.fName.category_nm
            })
            if (this.$route.params.name) {
                this.$apollo.query({
                    query: gql`{ fName(depth: 1, parent: something) { depth parent category_nm title category_idx access_auth private_yn desc } }`
                }).then(result => {
                    this.sub_category = result.data.fName.category_nm
                })
            }
        } else {
            window.location = '/error/404'
        }
    },
    created () {
        document.body.classList.toggle('loading')
    } 
}
</script>

<style lang="scss">

</style>