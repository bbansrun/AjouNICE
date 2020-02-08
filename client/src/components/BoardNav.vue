<template>
  <section class="board-menu">
    <header>
      <h4>옆의 아이콘을 클릭하여 게시물을 작성할 수 있습니다.</h4>
    </header>
    <nav class="board-nav">
      <ul class="menu menu-horizontal">
        <li>
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
  props: ['writeUrl'],
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.board-menu {
    position: absolute;
    width: 90vw;
    justify-content: space-between;
    background: -webkit-linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    left: 50%;
    transform: translate(-50%, -2.7rem);
    display: flex;
    z-index: 1000;
    box-shadow: 0px 7px 22px rgba(0,0,0,.25);
    > header {
        padding: .6rem;
        font-weight: bold;
    }
    > nav.board-nav {
        > ul.menu-horizontal {
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
