<template>
    <nav class="gnb" :class="{ 'active': (isFixedNavActive || isSlideNavActive) }">
        <div class="fixed-nav">
            <div class="icon-wrapper" @click="makeSlideNavActive">
                <span class="icon" :class="{ 'active': isSlideNavActive }">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
            <header class="title">
                <h1 data-logo>
                    <router-link to="/">AjouNICE!</router-link>
                </h1>
                <span>
                    <small>&nbsp;&nbsp;|&nbsp;&nbsp;아주대학교 대표 커뮤니티 서비스</small>
                </span>
            </header>
        </div>
        <ul class="slide-nav" :class="{ 'active': isSlideNavActive }">
            <li v-for="service in services" :key="service.id">
                <router-link :to="service.link">{{ service.label }}</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'nav',
    props: {
        services: Array,
        scrollBase: Number
    },
    data () {
        return {
            isSlideNavActive: false,
            isFixedNavActive: false
        }
    },
    methods: {
        makeSlideNavActive () {
            if (this.isSlideNavActive) {
                this.isSlideNavActive = false
            } else {
                this.isSlideNavActive = true
            }
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
    }
}
</script>