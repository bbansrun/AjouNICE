<template>
    <div class="home">
        <Nav :scrollBase="scrollBase" />
        <div class="container">
            <carousel ref="scrollBase" :data="carouselItems"></carousel>
            <Welcome :username="userInfo.name" :user_id="userInfo.idx" />
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
import Nav from '@/components/Navigation.vue'
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
            userInfo: {},
            iconNav: [
                { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
                { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/' },
                { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/place/bus' },
                { id: 4, title: '아주맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/place/gourmet' },
            ],
            carouselItems: [
                `<a data-slide-item href="/">
                    <div class="cover"></div>
                    <div class="slide-content">
                        <h2 data-logo>AjouNICE!</h2>
                        <small>아주대학교의 대표 커뮤니티 서비스입니다.</small>
                    </div>
                </a>`,
                `<a data-slide-item href="/about">
                    <div class="cover"></div>
                    <div class="slide-content">
                        <h2 data-logo>AjouNICE!</h2>
                        <small>서비스 오픈 일정 안내</small>
                    </div>
                </a>`,
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
        Nav,
        Welcome,
        IconNav,
        PostList,
        Slide,
        Footer
    },
    beforeCreate() {
        document.body.classList.remove('auth')
        this.$Axios.get('/api/protected').then(result => {
            this.userInfo = result.data.user
        }).catch(error => {
            this.$store.dispatch('LOGOUT').then(result => {
                window.location = '/'
            })
        })
    },
    mounted () {
        this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
    },
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
body {
    background: #eaeaea;
}

[data-slide-item] {
    display: block;
    position: relative;
    z-index: 0;
    > .cover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.4);
        z-index: -1;
    }
    > .slide-content {
        position: absolute;
        line-height: 1;
        bottom: 1rem;
        left: 1rem;
        z-index: 1;
        > h2 {
            margin-block-start: 0;
            margin-block-end: 0;
        }
    }
    background: url('http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual03.jpg') no-repeat center center/cover;
    color: #fff;
    font-size: 1.5rem;
    min-height: 10rem;
}

.broadcast {
    border: 1px solid #eee;
    border-radius: 0.25rem;
    display: flex;
    padding: 0.5rem 0.75rem;
}

.broadcast>.feather {
    margin-right: 0.5rem;
}

.broadcast>.carousel {
    flex: 1;
}

.broadcast-content {
    align-items: center;
    display: flex;
    justify-content: space-between;
}
</style>
