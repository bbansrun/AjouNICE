<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="user_nm"
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <section class="user">
        <div class="controls">
          <header>계정관리</header>
          <b-button
            v-show="$store.state.user.type === 'A'"
            type="is-danger"
            tag="router-link"
            to="/gate/manager"
          >
            <font-awesome-icon icon="users-cog" />
            <span>관리자</span>
          </b-button>
          <b-button
            type="is-warning"
            tag="router-link"
            :to="profileEditUrl"
          >
            <font-awesome-icon icon="user-lock" />
            <span>계정정보 수정</span>
          </b-button>
          <b-button
            type="is-danger"
            @click="secession"
          >
            <font-awesome-icon icon="sign-out-alt" />
            <span>회원탈퇴</span>
          </b-button>
        </div>
      </section>
      <MyPosts :posts="articles" />
      <MyReviews />
      <!-- 소속 학과 공지사항 -->
      <section class="notice">
        <article>
          <header class="underline underline-inline-block">
            소속학과 공지사항
          </header>
          <b-table
            :data="dpt.data"
            :loading="loading"
          >
            <template slot-scope="props">
              <b-table-column
                field="title"
                label="제목"
              >
                <a
                  :href="props.row.link"
                  target="_blank"
                >
                  {{ props.row.title }}
                </a>
              </b-table-column>
              <b-table-column
                field="unit"
                label="부서"
                sortable
              >
                {{ props.row.unit }}
              </b-table-column>
            </template>
          </b-table>
        </article>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import urljoin from 'url-join'
import gql from 'graphql-tag'
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import MyPosts from '@/components/user/MyPosts.vue'
import MyReviews from '@/components/user/MyLectureReviews.vue'
import Footer from '@/components/base/Footer.vue'
import { User, Notice } from '@/assets/graphql/queries'
export default {
  components: {
    Navigation,
    Landing,
    MyPosts,
    MyReviews,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      user_nm: null,
      articles: null,
      loading: true,
      dpt_cds: [],
      dpt: {
        data: []
      }
    }
  },
  computed: {
    profileEditUrl () {
      return urljoin(this.$route.path, '/edit')
    },
    myLectureReviewsLink () {
      return `/profile/${this.$store.state.user.idx}/lectures/reviews`
    }
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${User}`,
      variables: {
        id: this.$store.state.user.idx
      }
    }).then(({ data }) => {
      this.articles = data.user.articles
      this.user_nm = data.user.user_nm
      this.dpt_cds = data.user.dpt_cd.split(',')
      this.loadNotice()
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
    loadNotice () {
      for (const dpt of this.dpt_cds) {
        this.$apollo.query({
          query: gql`${Notice}`,
          variables: {
            code: dpt
          }
        }).then(({ data }) => {
          this.dpt.data = this.dpt.data.concat(data.notice)
        })
      }
      this.loading = false
    },
    secession () {
      this.$swal({
        title: '정말 탈퇴하시겠습니까?',
        width: '90vw',
        type: 'warning',
        text: '탈퇴하시면 30일간 재가입이 불가합니다. 작성하신 모든 게시물은 삭제되나, 계정정보는 동의하셨던 약관 내용에 따라 1년간 보관후 폐기됩니다.',
        footer: '동의하시면 계속 진행하여주세요.',
        showCancelButton: true,
        confirmButtonText: '탈퇴',
        cancelButtonText: '취소',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return '탈퇴'
        }
      }).then((result) => {
        if (result.value) {
          // 탈퇴 진행
          this.$store.dispatch('LOGOUT').then(() => {
            this.flash('탈퇴되었습니다.', 'success')
            this.$router.push('/')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  > .card {
    margin-bottom: .8rem;
    & .title {
      font-size: 1.2rem;
    }
    & .subtitle {
      font-size: .8rem;
    }
  }
}
</style>
