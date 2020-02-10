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
  },
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        document.body.classList.toggle('loading')
        this.$router.push('/')
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin {
  display: grid;
  grid-template-columns: 1fr 9fr;
  min-height: 70vh;
  > aside {
    background: #e3e3e3;
  }
}

main {
  padding: 1rem 2rem;
}
</style>
