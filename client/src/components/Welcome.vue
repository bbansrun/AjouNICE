<template>
  <section
    v-if="$store.state.user"
    class="welcome signed-in-user"
  >
    <header>
      <h4>{{ $store.state.user.name }}님, 환영합니다.</h4>
    </header>
    <nav class="welcome-nav">
      <ul class="menu menu-horizontal">
        <li>
          <router-link :to="`/profile/${$store.state.user.idx}`">
            <font-awesome-icon icon="user" />
          </router-link>
        </li>
        <li>
          <a @click="logout">
            <font-awesome-icon icon="sign-out-alt" />
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
            <font-awesome-icon icon="key" />
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        document.body.classList.toggle('loading')
        window.location = '/'
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: -webkit-linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    > header {
        padding: 1rem;
        > h2 {

        }
    }
    > nav.welcome-nav {
        > ul.menu-horizontal {
            > li {
                display: inline-block;
                padding: 1rem;
                > a {
                    display: inherit;
                    color: #fff;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
