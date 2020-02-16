<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>객체지향프로그래밍 (떼무)</strong>
        </header>
        <div class="card">
          <div class="card-header" />
          <div class="card-content" />
          <div class="card-footer" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/base/Navigation.vue'
import Footer from '@/components/base/Footer.vue'

export default {
  components: {
    Navigation, Footer
  },
  data () {
    return {
    }
  }
}
</script>
