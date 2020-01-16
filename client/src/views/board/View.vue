<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" :title="title" description="" background="" />
        <div class="container"></div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    name: 'app',
    components: {
        Navigation, Landing, Footer
    },
    data () {
        return {
            scrollBase: null,
            title: '',
            meta: {},
            body: '',
        }
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    }
}
</script>