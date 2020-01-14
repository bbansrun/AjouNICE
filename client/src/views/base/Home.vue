<template>
    <div class="home">
        <!-- <Nav /> -->
        <div class="container">
            <carousel :data="carouselItems"></carousel>
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
import Footer from '@/components/Footer.vue'

export default {
    name: 'home',
    data() {
        return {
            userInfo: {},
            iconNav: [
                { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
                { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/' },
                { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/place/bus' },
                { id: 4, title: '아주맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/place/gourmet' },
            ],
            carouselItems: [
                '<div class="example-slide">Slide 1</div>',
                '<div class="example-slide">Slide 2</div>',
                '<div class="example-slide">Slide 3</div>',
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

.example-slide {
    align-items: center;
    background-color: #666;
    color: #999;
    display: flex;
    font-size: 1.5rem;
    justify-content: center;
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
