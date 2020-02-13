<template>
  <div class="wrapper">
    <section class="admin admin-dashboard">
      <Aside :modules="modules" />
      <main>
        <router-view />
      </main>
    </section>
    <Footer />
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import Aside from '@/components/admin/Aside.vue'
import Footer from '@/components/admin/Footer.vue'
export default {
  components: {
    Aside, Footer
  },
  data () {
    return {
      modules: [
        { id: uuid(), label: '홈', link: '/gate/manager', icon: 'home' },
        { id: uuid(), label: '사용자 관리', link: '/gate/manager/users', icon: 'users' },
        { id: uuid(), label: '게시판 관리', link: '/gate/manager/boards', icon: 'sticky-note' }
      ]
    }
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

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1rem;
}

main {
  padding: 1rem 2rem;
}
</style>
