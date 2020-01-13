<template>
    <div class="wrapper">
        <Landing title="사이트맵" background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg" />
        <div class="container"></div>
        <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
 components: {
     Landing, Footer
 }   
}
</script>