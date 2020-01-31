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
        <div class="notification is-primary">
          <b-button
            type="is-info"
            tag="router-link"
            :to="myLectureReviewsLink"
          >
            나의 강의평가
          </b-button>
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
    </div>
    <Footer />
  </div>
</template>

<script>
import urljoin from 'url-join'
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      user_nm: null
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
    const _this = this
    this.$apollo.query({
      query: gql`{ findUserByIdx(user_idx: ${_this.$route.params.user_id}) { user_nm } }`
    }).then(result => {
      _this.user_nm = result.data.findUserByIdx.user_nm
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
