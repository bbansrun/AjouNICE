<template>
  <nav
    class="gnb"
    :class="{ 'active': (isFixedNavActive || isSlideNavActive || isStatic), 'static': isStatic }"
  >
    <div class="fixed-nav">
      <div
        class="icon-wrapper"
        @click="makeSlideNavActive"
      >
        <span
          class="icon"
          :class="{ 'active': isSlideNavActive }"
        >
          <span />
          <span />
          <span />
        </span>
      </div>
      <header class="header">
        <h1 data-logo>
          <router-link to="/">
            AjouNICE!
          </router-link>
        </h1>
        <span>
          <small>&nbsp;&nbsp;|&nbsp;&nbsp;<strong>아주대학교 대표 커뮤니티 서비스</strong></small>
        </span>
      </header>
    </div>
    <div
      class="slide-nav"
      :class="{ 'active': isSlideNavActive }"
    >
      <section class="auth">
        <div
          v-if="userState"
          class="signed-in-user"
        >
          <h3>{{ userState.name }}님, 환영합니다.</h3>
          <div class="btn-wrapper">
            <div class="btn btn-half-extended logout">
              <a
                data-logout
                @click="logout"
              >
                <font-awesome-icon icon="sign-out-alt" />
                <span>로그아웃</span>
              </a>
            </div>
            <div class="btn btn-half-extended profile">
              <router-link :to="userProfileLink">
                <font-awesome-icon icon="user" />
                <span>마이페이지</span>
              </router-link>
            </div>
          </div>
        </div>
        <div
          v-else
          class="not-signed-in-user"
        >
          <h3>로그인이 필요합니다.</h3>
          <div class="btn-wrapper">
            <div class="btn btn-extended login">
              <router-link to="/auth/login">
                <font-awesome-icon icon="key" />
                <span>로그인</span>
              </router-link>
            </div>
          </div>
        </div>
      </section>
      <section class="major-menus">
        <h3 class="underline">
          주요 메뉴
        </h3>
        <ul class="slide-nav-menus">
          <li
            v-for="service in services"
            :key="service.id"
            class="btn btn-menu"
          >
            <router-link :to="service.link">
              <span>{{ service.label }}</span>
              <font-awesome-icon icon="arrow-alt-circle-right" />
            </router-link>
          </li>
        </ul>
      </section>
      <footer class="footer footer-slide-nav">
        <p>
          <strong>아주나이스는 모바일 기기에 최적화되어 있습니다. (PC 버전 향후 제공예정)</strong>
        </p>
        <router-link
          v-for="item in footerLinks"
          :key="item.id"
          :to="item.link"
        >
          <strong>{{ item.label }}</strong>
        </router-link>
      </footer>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    isStatic: Boolean,
    scrollBase: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isSlideNavActive: false,
      isFixedNavActive: false,
      services: [
        { id: 1, label: '커뮤니티', link: '/board' },
        { id: 2, label: '아주맛집', link: '/place/gourmet' },
        { id: 3, label: '강의평가', link: '/lectures' },
        { id: 4, label: '학사일정', link: '/schedule' },
        { id: 5, label: 'Ajou버스', link: '/place/bus' }
      ],
      footerLinks: [
        { id: 1, label: '서비스 소개', link: '/about' },
        { id: 2, label: '광고.제휴/기타문의', link: '/contact' },
        { id: 3, label: '이용약관', link: '/policy' },
        { id: 4, label: '사이트맵', link: '/sitemap' }
      ]
    }
  },
  computed: {
    userState () {
      return this.$store.state.user
    },
    userProfileLink () {
      return '/my'
    }
  },
  mounted () {
    window.addEventListener('scroll', (e) => {
      if (window.scrollY > this.scrollBase - 45) {
        this.isFixedNavActive = true
      } else {
        this.isFixedNavActive = false
      }
    })
  },
  methods: {
    makeSlideNavActive () {
      if (this.isSlideNavActive) {
        this.isSlideNavActive = false
      } else {
        this.isSlideNavActive = true
      }
    },
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        document.body.classList.toggle('loading')
        this.$router.go(0)
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.gnb .header span small strong {
  color: #fff;
}
.slide-nav {
  > .auth {
    padding: 2rem 1rem;
    background: skyblue;
    & h3 {
      font-weight: 600;
    }
    & .btn-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      > .btn {
        width: 50%;
        height: 6rem;
        text-align: center;
        transition: unset;
        &:hover {
          & a {
            color: #333 !important;
          }
          transform: unset;
        }
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 1px;
          height: 40px;
          margin-top: -20px;
          background: rgba(0,0,0,.5);
        }
        &:last-child::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          width: 1px;
          height: 40px;
          margin-top: -20px;
          background: rgba(0,0,0,.5);
        }
        > a {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 6vw;
          color: #333;
          > span {
            font-size: 3vw;
          }
        }
      }
    }
  }
}
.major-menus {
  padding: 1rem;
  > h3 {
    font-weight: 600;
  }
  > .slide-nav-menus {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: .5rem;
    column-gap: .5rem;
    margin-top: 1rem;
    > li {
      background: #fff;
      padding: 2rem 1rem;
      &.btn {
        &:hover {
          transform: unset;
          & a {
            color: #333 !important;
          }
        }
      }
      > a {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #333;
        font-size: 6vw;
        > span {
          font-size: 3.5vw;
        }
      }
    }
  }
}
.footer-slide-nav {
    background: #eee !important;
    padding: 1rem 0;
    color: #333;
    text-align: center;
    & p {
      font-size: .75rem;
    }
    & a {
        font-size: .6rem;
        padding: 0 1rem;
        &:hover {
            color: #333 !important;
        }
        &:last-child::after {
            content: '';
            position: absolute;
            background: #aaa;
            width: 1px;
            height: 1rem;
            right: 0;
            top: 50%;
            margin-top: -.5rem;
        }
        &::before {
            content: '';
            position: absolute;
            background: #aaa;
            width: 1px;
            height: 1rem;
            left: 0;
            top: 50%;
            margin-top: -.5rem;
        }
    }
}
</style>
