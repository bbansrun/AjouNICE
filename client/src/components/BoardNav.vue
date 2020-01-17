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
    > nav.board-nav {
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