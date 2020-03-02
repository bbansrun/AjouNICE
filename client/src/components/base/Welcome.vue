<template>
  <section
    v-if="!anonymous"
    class="welcome signed-in-user"
  >
    <header>
      <h4>{{ user.user_nm }}님, 환영합니다.</h4>
    </header>
    <nav class="welcome-nav">
      <ul class="menu menu-horizontal">
        <li>
          <router-link to="/my">
            <font-awesome-icon icon="user" />&nbsp;
            <span>마이페이지</span>
          </router-link>
        </li>
        <li>
          <a @click="logout">
            <font-awesome-icon icon="sign-out-alt" />&nbsp;
            <span>로그아웃</span>
          </a>
        </li>
      </ul>
    </nav>
  </section>
  <section
    v-else
    class="welcome not-signed-in-user"
  >
    <header>
      <h4>서비스 이용을 위해 로그인하시기 바랍니다.</h4>
    </header>
    <nav class="welcome-nav">
      <ul class="menu menu-horizontal">
        <li>
          <router-link to="/auth/login">
            <font-awesome-icon icon="key" />&nbsp;
            <span>로그인</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
export default {
  props: {
    user: { type: Object, default: () => ({ user_nm: null }) },
    anonymous: { type: Boolean, required: true }
  },
  methods: {
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
body.isMobile {
  & ul.menu {
    > li {
      > a {
        > span {
          display: none;
        }
      }
    }
  }
}
.welcome {
    position: absolute;
    width: 90vw;
    justify-content: space-between;
    background: -webkit-linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    left: 50%;
    transform: translate(-50%, -1.5rem);
    display: flex;
    z-index: 1000;
    box-shadow: 0px 7px 22px rgba(0,0,0,.25);
    > header {
      font-weight: bold;
      padding: .6rem;
    }
    > nav.welcome-nav {
        > ul.menu-horizontal {
            > li {
                display: inline-block;
                padding: .6rem 1rem;
                > a {
                    display: inherit;
                    color: #fff;
                    transition: .2s all ease;
                    &:hover {
                        cursor: pointer;
                        text-shadow: 0 2px 2px rgba(0,0,0,.8),
                    }
                }
            }
        }
    }
}
</style>
