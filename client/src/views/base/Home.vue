<template>
    <div class="home">
        <Navigation :scrollBase="scrollBase" />
        <div class="container">
            <carousel ref="scrollBase" :data="carouselItems"></carousel>
            <Welcome :username="$store.state.user.name" :user_id="$store.state.user.idx" />
            <IconNav :data="iconNav" />
            <div class="broadcast">
                <feather type="radio"></feather>
                <carousel :data="carouselRadio" :controls="false" :indicators="false" :interval="3000" direction="up"></carousel>
            </div>
            <PostList showHeader showThumbnail />
            <PostList showHeader showThumbnail />
        </div>
        <Footer />
    </div>
</template>

<script>
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import Welcome from '@/components/Welcome.vue'
import IconNav from '@/components/IconNav.vue'
import PostList from '@/components/PostList.vue'
import Slide from '@/components/Slide.vue'
import Footer from '@/components/Footer.vue'

export default {
    name: 'home',
    data() {
        return {
            scrollBase: null,
            iconNav: [
                { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
                { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/schedule' },
                { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/place/bus' },
                { id: 4, title: '아주맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/place/gourmet' },
                { id: 5, title: '강의평가', background: 'https://image.flaticon.com/icons/png/512/234/234721.png', link: '/lectures' },
            ],
            carouselItems: [
                `<a data-slide-item href="/">
                    <div class="cover"></div>
                    <div class="slide-content">
                        <h2 data-logo>AjouNICE!</h2>
                        <small>아주대학교의 대표 커뮤니티 서비스입니다.</small>
                    </div>
                </a>`,
                // `<a data-slide-item href="/about">
                //     <div class="cover"></div>
                //     <div class="slide-content">
                //         <h2 data-logo>AjouNICE!</h2>
                //         <small>서비스 오픈 일정 안내</small>
                //     </div>
                // </a>`,
            ],
            carouselRadio: [{
                    id: 1,
                    message: '[빤스런] 김호영',
                    content(createElement, content) {
                        return createElement('a', {
                            attrs: {
                                href: '#',
                            },

                            class: 'broadcast-content',
                        }, [
                            createElement('span', [`${content.message} ${content.id}`]),
                            createElement('feather', {
                                props: {
                                    size: 16,
                                    type: 'chevron-right',
                                },
                            }),
                        ]);
                    },
                },
                {
                    id: 2,
                    message: '[빤스런] 최성흠',
                    content(createElement, content) {
                        return createElement('a', {
                            attrs: {
                                href: '#',
                            },

                            class: 'broadcast-content',
                        }, [
                            createElement('span', [`${content.message} ${content.id}`]),
                            createElement('feather', {
                                props: {
                                    size: 16,
                                    type: 'chevron-right',
                                },
                            }),
                        ]);
                    },
                },
                {
                    id: 3,
                    message: '[빤스런] 전지원',
                    content(createElement, content) {
                        return createElement('a', {
                            attrs: {
                                href: '#',
                            },

                            class: 'broadcast-content',
                        }, [
                            createElement('span', [`${content.message} ${content.id}`]),
                            createElement('feather', {
                                props: {
                                    size: 16,
                                    type: 'chevron-right',
                                },
                            }),
                        ])
                    },
                },
            ],
        }
    },
    components: {
        Navigation,
        Welcome,
        IconNav,
        PostList,
        Slide,
        Footer
    },
    beforeCreate() {
        document.body.classList.remove('auth')
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
    },
}
</script>

<style lang="scss" scoped>
.carousel {
  min-height: unset;
}
</style>