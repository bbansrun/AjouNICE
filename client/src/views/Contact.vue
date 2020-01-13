<template>
    <div class="wrapper">
        <Landing title="연락" description="개발팀에 궁금한 것이 있으시면 연락주시기 바랍니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual01.jpg" />
        <div class="container">
        </div>
        <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    name: 'contact',
    components: {
        Landing, Footer
    }
}
</script>

<style lang="scss">

</style>