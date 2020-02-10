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
          <b-button
            type="is-warning"
            tag="router-link"
            :to="profileEditUrl"
          >
            계정정보 수정
          </b-button>
          <b-button
            type="is-danger"
            @click="secession"
          >
            회원탈퇴
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
          <div
            v-for="notice in notices"
            :key="notice.link"
            class="notice"
          >
            <div class="card">
              <div class="card-content">
                <p class="title">
                  <a
                    :href="notice.link"
                    target="_blank"
                  >{{ notice.title }}</a>
                </p>
                <p class="subtitle">
                  {{ notice.unit }}
                </p>
              </div>
            </div>
          </div>
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
      notices: []
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
      for (const dpt of data.user.dpt_cd.split(',')) {
        this.$apollo.query({
          query: gql`${Notice}`,
          variables: {
            code: dpt
          }
        }).then(({ data }) => {
          this.notices = this.notices.concat(data.notice)
        })
      }
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  },
  methods: {
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
            window.location = '/'
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
