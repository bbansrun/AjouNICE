<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="board.category_nm"
      description=""
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <main>
      <div class="wrapper container">
        <b-notification
          type="is-info"
          has-icon
          aria-close-label="닫기"
          role="alert"
        >
          <span>맛집의 경우 객관적인 정보 제공과 중복 방지를 위하여 관리자가 직접 관리하고 있습니다. 갱신이 필요하거나 데이터 추가를 원하시는 경우 <router-link
            class="underline underline-animated"
            to="/contact"
          >아래 광고/제휴/기타문의</router-link> 영역을 통해 관리자에게 연락하여주시면 감사하겠습니다.</span>
        </b-notification>
        <hr>
        <header class="underline underline-inline-block underline-animated">
          <strong>{{ board.category_nm }}</strong>
        </header>
        <GourmetList :items="items" />
        <infinite-loading
          spinner="waveDots"
          @infinite="infiniteHandler"
        >
          <div slot="no-more">
            <font-awesome-icon icon="times" />&nbsp;
            <span>더 이상 게시물이 없어요.</span>
          </div>
          <div slot="no-results">
            찾으시는 게시물이 없어요.
          </div>
        </infinite-loading>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Navigation, Landing, Footer, GourmetList } from '@/components'
import { BoardByType, PaginationGourmets } from '@/assets/graphql/queries'
export default {
  components: {
    Navigation,
    Landing,
    Footer,
    GourmetList
  },
  data () {
    return {
      category: this.$route.params.category,
      scrollBase: null,
      items: [],
      cursor: ''
    }
  },
  apollo: {
    board: {
      query: gql`${BoardByType}`,
      variables () {
        return {
          cateType: 'GOURMET',
          title: this.category
        }
      },
      update: data => data.boardByType
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    infiniteHandler ($state) {
      this.$apollo.query({
        query: gql`${PaginationGourmets}`,
        variables: {
          cateId: this.board.category_idx,
          cursor: this.cursor
        }
      }).then(({ data: { paginatedGourmets: { pageInfo, edges } } }) => {
        this.items = this.items.concat(edges)
        if (pageInfo.hasNext) {
          this.cursor = pageInfo.after
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }
  }
}
</script>
