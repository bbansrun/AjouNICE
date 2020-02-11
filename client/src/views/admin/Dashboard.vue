<template>
  <div class="wrapper">
    <section class="admin admin-dashboard">
      <Aside />
      <main>
        메인 영역
      </main>
    </section>
    <Footer />
  </div>
</template>

<script>
import Aside from '@/components/admin/Aside.vue'
import Footer from '@/components/admin/Footer.vue'
export default {
  components: {
    Aside, Footer
  }
}
</script>

<style lang="scss" scoped>
.admin {
  display: grid;
  grid-template-columns: 1fr 9fr;
  min-height: calc(100vh - 32px);
  > aside {
    background: #e3e3e3;
  }
}

main {
  padding: 1rem 2rem;
}
</style>
