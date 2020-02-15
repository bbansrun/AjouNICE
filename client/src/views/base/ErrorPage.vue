<template>
  <main>
    <section id="error">
      <header id="error_code">
        <h1 data-logo>
          <span>X_X</span><br>
          <span
            v-show="errCode"
            class="code"
          >
            {{ errCode }}
          </span>
        </h1>
      </header>
      <div
        id="error_desc"
        align="center"
      >
        <header>{{ description }}</header>
        <p>{{ sub_description }}</p>
        <a
          v-show="errCode === 500"
          href="mailto:team.ajounice@gmail.com"
          class="underline"
        >
          오류 리포트
        </a>
      </div>
      <nav id="error_nav">
        <router-link
          to="/"
          class="btn rounded-on-hover box-shadow-on-hover text-inverse"
        >
          → 처음으로
        </router-link>
      </nav>
      <div class="logo">
        <h2 data-logo>
          AjouNICE!
        </h2>
        <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
        <span>아주대학교 커뮤니티 서비스</span>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data () {
    return {
      errCode: null,
      errData: {
        401: {
          title: '서비스 이용을 위한 이메일 인증이 필요합니다.',
          description: '회원가입시 입력하신 이메일 수신함을 확인해주시기 바랍니다.'
        },
        403: {
          title: '페이지에 접속할 수 없습니다.',
          description: '이 페이지를 접근할 수 있는 권한이 없습니다.'
        },
        404: {
          title: '페이지를 찾을 수 없습니다.',
          description: '올바른 주소인지 확인하여 주시기 바랍니다.'
        },
        405: {
          title: '해당 요청은 사용할 수 없습니다.',
          description: '지원되지 않는 요청입니다.'
        },
        500: {
          title: '서비스에 오류가 있습니다.',
          description: '같은 상황이 지속되는 경우 개발팀으로 연락주시기 바랍니다.'
        },
        503: {
          title: '서비스에 일시적 문제가 발생하였습니다.',
          description: '잠시 후에 다시 접속바랍니다.'
        }
      }
    }
  },
  computed: {
    description () {
      return this.errData[this.$route.params.code].title
    },
    sub_description () {
      return this.errData[this.$route.params.code].description
    }
  },
  beforeMount () {
    if (this.code() in this.errData) {
      this.errCode = this.code()
    } else {
      this.$router.push('/error/404')
    }
  },
  methods: {
    code () {
      return this.$route.params.code
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    padding: .6rem 3rem;
    margin-top: 1rem;
    background: #a18cd1;
    &:hover {
        color: #fff;
        background: purple;
    }
}
</style>
