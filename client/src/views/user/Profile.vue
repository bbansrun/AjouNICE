<template>
    <div class="wrapper">
        <Landing title="프로필" />
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