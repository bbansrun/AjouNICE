<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="AjouNICE!"
      description="아주나이스 서비스를 소개합니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif"
      is-logo
    />
    <main>
      <div class="wrapper container">
        <section class="about">
          <header>
            <strong>차세대 학부 커뮤니티 서비스를 지향합니다.</strong>
          </header>
          <p>Mobile First와 정보공유에 초점을 두고 개발된 프로젝트입니다.</p>
          <hr>
          <header class="underline underline-inline-block">
            <strong>서비스 공지사항</strong>
          </header>
          <b-table
            :data="data"
            :loading="loading"

            paginated
            backend-pagination
            :total="total"
            :per-page="perPage"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            backend-sorting

            :default-sort-direction="defaultSortOrder"
            :default-sort="[sortField, sortOrder]"
            @page-change="onPageChange"
            @sort="onSort"
          >
            <template slot-scope="props">
              <b-table-column
                field="title"
                label="제목"
              >
                <router-link :to="`/board/${props.row.board_idx}/view`">
                  <strong>{{ props.row.title }}</strong>
                </router-link>
              </b-table-column>

              <b-table-column
                field="view_cnt"
                label="조회수"
              >
                {{ props.row.view_cnt }}
              </b-table-column>

              <b-table-column
                field="user_nm"
                label="작성자"
              >
                {{ props.row.user.user_nm }}
              </b-table-column>
            </template>
          </b-table>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { ServiceNotice } from '@/assets/graphql/queries'
import { Navigation, Landing, Footer } from '@/components'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      total: 0,
      loading: false,
      sortField: 'board_idx',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  },
  apollo: {
    data: {
      query: gql`${ServiceNotice}`,
      result ({ data }) {
        this.data = data.boards[0].posts
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    onPageChange (page) {
      this.page = page
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  padding: 0 2rem;
  & header {
    font-weight: bold;
    font-size: 1.5rem;
  }
}
</style>
