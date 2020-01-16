<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" title="" description="" background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg" />
        <div class="container"></div>
        <Footer />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    components: {
        Navigation, Landing, Footer
    },
    data () {
        return {
            scrollBase: null
        }
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    }
}
</script>