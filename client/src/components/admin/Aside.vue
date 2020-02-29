<template>
  <aside>
    <div class="container">
      <header>
        <Logo />
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
            :active="$route.path === item.link"
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
            tag="a"
            target="_blank"
            label="API 관리"
            href="http://localhost:455/playground"
            icon="cog"
            :active="false"
          />
          <b-menu-item
            tag="router-link"
            label="메인으로"
            to="/"
            icon="home"
            :active="false"
          />
          <b-menu-item
            label="로그아웃"
            icon="sign-out-alt"
            :active="false"
            @click="logout"
          />
        </b-menu-list>
      </b-menu>
    </div>
  </aside>
</template>

<script>
import Logo from '@/assets/images/AjouNICE_shadow.svg'
export default {
  components: {
    Logo
  },
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
svg {
  fill: #fff;
}

aside {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  & small {
    > strong {
      color: #fff;
    }
  }
  & hr {
    margin: .5rem 2rem;
  }
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

.menu-label {
  color: #fff;
  font-weight: bold;
}
</style>

<style lang="scss">
ul.menu-list {
 > li {
   > a {
     display: flex;
     flex-direction: row;
     align-items: center;
     > span:first-of-type {
       margin-right: .5rem;
     }
   }
 }
}
</style>
