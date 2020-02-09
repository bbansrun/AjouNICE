<template>
  <div class="wrapper">
    <Landing />
    <div class="container" />
    <Footer />
  </div>
</template>

<script>
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'
export default {
  components: {
    Landing, Footer
  }
}
</script>
