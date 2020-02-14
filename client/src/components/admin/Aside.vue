<template>
  <aside>
    <div class="container">
      <header>
        <h2 data-logo>
          AjouNICE!
        </h2>
        <small>
          <strong>관리자</strong>
        </small>
      </header>
      <hr>
      <nav class="lnb">
        <ul class="menus">
          <li
            v-for="item in modules"
            :key="item.id"
            :class="{ 'active': item.link === $route.path }"
          >
            <router-link :to="item.link">
              <font-awesome-icon :icon="item.icon" />
              <span>{{ item.label }}</span>
            </router-link>
            <ul v-show="item.hasOwnProperty('children')">
              <li
                v-for="child in item.children"
                :key="child.id"
              >
                <small>{{ child.label }}</small>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <hr>
      <div class="controls">
        <ul class="menus">
          <li>
            <router-link to="/">
              <font-awesome-icon icon="home" />
              <span>메인으로</span>
            </router-link>
          </li>
          <li>
            <a @click="logout">
              <font-awesome-icon icon="sign-out-alt" />
              <span>로그아웃</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    modules: {
      type: Array,
      required: true
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        document.body.classList.toggle('loading')
        this.$router.push('/')
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
aside {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)
}

.container {
  > header {
    padding: 1rem;
    line-height: 1;
    text-align: center;
    margin-bottom: .5rem;
  }
}

ul.menus {
  > li {
    > a {
      color: #3e3e3e;
      padding: .5rem 1rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    &.active {
      a {
        color: red;
      }
    }
  }
}
</style>
