<template>
    <section class="welcome">
        <header>
            <h2>{{ username }}님, 환영합니다.</h2>
        </header>
        <nav class="welcome-nav">
            <ul class="menu menu-horizontal">
                <li>
                    <router-link :to="`/profile/${user_id}`">
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
</template>

<script>
export default {
    props: ['username', 'user_id'],
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