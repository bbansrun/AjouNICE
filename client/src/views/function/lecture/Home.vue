<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" title="강의평가" description="여러분의 수강후기를 공유해주세요." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg" />
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
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
 }
}
</script>