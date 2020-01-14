<template>
    <div class="wrapper">
        <Landing :title="title" description="" background="" />
        <div class="container"></div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    name: 'app',
    components: {
        Landing, Footer
    },
    data () {
        return {
            title: '',
            meta: {},
            body: '',
        }
    },
    beforeMount () {
        // this.$apollo.query({
        //     query: gql``
        // }).then(result => {
            
        // }).catch(error => {
        //     console.error(error)
        // })
    }
}
</script>