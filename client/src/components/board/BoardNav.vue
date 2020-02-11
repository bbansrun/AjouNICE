<template>
  <section class="board-menu">
    <header v-show="!searchActive">
      <h4>옆의 아이콘을 클릭하여 게시물을 작성할 수 있습니다.</h4>
    </header>
    <form
      v-show="searchActive"
      @submit.prevent="searchKeyword"
    >
      <div class="input-form">
        <input
          id="search"
          v-model="keyword"
          type="search"
          name="keyword"
          placeholder="검색어를 입력하여 게시물을 검색하세요."
        >
      </div>
    </form>
    <nav class="board-nav">
      <ul class="menu menu-horizontal">
        <li>
          <a @click="activateSearch">
            <font-awesome-icon icon="search-plus" />
          </a>
        </li>
        <li v-show="!searchActive">
          <router-link :to="writeUrl">
            <font-awesome-icon icon="pen" />
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
export default {
  props: {
    writeUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchActive: false,
      keyword: ''
    }
  },
  methods: {
    activateSearch () {
      if (this.searchActive) this.searchActive = false
      else this.searchActive = true
    },
    searchKeyword () {
      this.$router.push({
        path: '/board/search',
        query: { keyword: this.keyword }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.board-menu {
  position: absolute;
  width: 90vw;
  display: grid;
  grid-template-columns: 4fr 1fr;
  background: -webkit-linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: #fff;
  left: 50%;
  transform: translate(-50%, -2.7rem);
  z-index: 1000;
  box-shadow: 0px 7px 22px rgba(0,0,0,.25);
  > header {
    width: 100%;
    padding: .6rem;
    font-weight: bold;
  }
  > form {
    display: flex;
    justify-content: center;
    align-items: center;
    > .input-form {
      position: relative;
      width: 100%;
      > input[type="search"] {
        position: relative;
        width: inherit;
        padding: .5rem .5rem;
        background: none;
        outline: none;
        border: none;
        color: #fff;
        font: {
          size: 1rem;
        }
        &::placeholder {
          color: rgba(255,255,255,.6);
        }
      }
    }
  }
  > nav.board-nav {
    > ul.menu-horizontal {
      text-align: right;
      > li {
        display: inline-block;
        padding: .6rem 1rem;
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
