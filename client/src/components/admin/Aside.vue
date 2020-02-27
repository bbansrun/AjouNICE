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
      <b-menu class="lnb">
        <b-menu-list
          label="메뉴"
          icon-pack="fas"
        >
          <b-menu-item
            v-for="item in modules"
            :key="item.id"
            :icon="item.icon"
            :label="item.label"
            tag="router-link"
            :to="item.link"
            class="link"
          >
            <b-menu-item
              v-for="child in item.children"
              v-show="item.hasOwnProperty('children')"
              :key="child.id"
              tag="router-link"
              :label="child.label"
              :to="child.link"
            />
          </b-menu-item>
        </b-menu-list>
        <b-menu-list label="조작">
          <b-menu-item
            tag="router-link"
            label="메인으로"
            to="/"
            icon="home"
          />
          <b-menu-item
            label="로그아웃"
            icon="sign-out-alt"
            @click="logout"
          />
        </b-menu-list>
      </b-menu>
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

.lnb {
  padding: 0 .5rem;
}

</style>
