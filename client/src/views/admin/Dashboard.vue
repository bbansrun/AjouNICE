<template>
  <div class="wrapper">
    <div class="admin admin-dashboard">
      <Aside :modules="modules" />
      <main>
        <div class="wrapper content">
          <router-view />
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import { Aside, AdminFooter as Footer } from '@/components'
export default {
  components: {
    Aside,
    Footer
  },
  data () {
    return {
      modules: [
        {
          id: uuid(),
          label: '홈',
          link: '/gate/manager',
          icon: 'home'
        },
        {
          id: uuid(),
          label: '공지사항 관리',
          link: '/gate/manager/notice',
          icon: 'list'
        },
        {
          id: uuid(),
          label: '코드 관리',
          link: '/gate/manager/codes',
          icon: 'list'
        },
        {
          id: uuid(),
          label: '사용자 관리',
          link: '/gate/manager/users',
          icon: 'users'
        },
        {
          id: uuid(),
          label: '게시판 관리',
          link: '/gate/manager/boards',
          icon: 'sticky-note',
          children: [
            { id: uuid(), label: '일반 게시판', link: '/gate/manager/boards', icon: 'sticky-note' },
            { id: uuid(), label: '맛집 게시판', link: '/gate/manager/boards/gourmet', icon: 'sticky-note' },
            { id: uuid(), label: '부동산', link: '/gate/manager/boards/realty', icon: 'sticky-note' },
            { id: uuid(), label: '강의평가', link: '/gate/manager/boards/reivews', icon: 'sticky-note' }
          ]
        },
        {
          id: uuid(),
          label: '권한 관리',
          link: '/gate/manager/permissions',
          icon: 'users-cog'
        },
        {
          id: uuid(),
          label: '차단 관리',
          link: '/gate/manager/restrictions',
          icon: 'times'
        },
        {
          id: uuid(),
          label: '팝업 관리',
          link: '/gate/manager/popups',
          icon: 'sticky-note'
        },
        {
          id: uuid(),
          label: 'API 관리',
          link: `http://${require('ip').address()}:455/playground`,
          outLink: true,
          icon: 'sticky-note'
        }
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
