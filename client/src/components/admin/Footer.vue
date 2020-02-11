<template>
  <footer>
    <section class="wrapper">
      <div class="footer-content">
        <header>
          <span data-logo><small>AjouNICE!</small></span>&nbsp;<small>관리자 페이지는 PC에 최적화되어있습니다.</small>
        </header>
      </div>
    </section>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      year: null
    }
  },
  mounted () {
    this.year = new Date().getUTCFullYear()
  }
}
</script>

<style lang="scss" scoped>
footer {
  padding: unset;
}
</style>
