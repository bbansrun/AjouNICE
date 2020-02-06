<template>
  <div class="home">
    <Navigation :scroll-base="scrollBase" />
    <div class="container">
      <carousel
        ref="scrollBase"
        :data="carouselItems"
      />
      <Welcome />
      <IconNav :data="iconNav" />
      <div class="broadcast">
        <feather type="radio" />
        <carousel
          :data="carouselRadio"
          :controls="false"
          :indicators="false"
          :interval="3000"
          direction="up"
        />
      </div>
      <PostList
        show-header
        show-thumbnail
        :items="posts"
      />
      <PostList
        show-header
        show-thumbnail
        :items="posts"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Welcome from '@/components/Welcome.vue'
import IconNav from '@/components/IconNav.vue'
import PostList from '@/components/PostList.vue'
import Footer from '@/components/Footer.vue'
import { AllPosts } from '@/assets/graphql/queries'
export default {
  name: 'Home',
  components: {
    Navigation,
    Welcome,
    IconNav,
    PostList,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      iconNav: [
        { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
        { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/schedule' },
        { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/place/bus' },
        { id: 4, title: '아주맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/place/gourmet' },
        { id: 5, title: '강의평가', background: 'https://image.flaticon.com/icons/png/512/234/234721.png', link: '/lectures' }
      ],
      carouselItems: [
                `<a data-slide-item href="/">
                    <div class="cover"></div>
                    <div class="slide-content">
                        <h2 data-logo>AjouNICE!</h2>
                        <small>아주대학교의 대표 커뮤니티 서비스입니다.</small>
                    </div>
                </a>`
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
        message: '[공지사항] 신종 코로나바이러스로 인한 입학식, 졸업식 등 2월 주요 행사 취소 안내',
        content (createElement, content) {
          return createElement('a', {
            attrs: {
              href: '#'
            },
            class: 'broadcast-content'
          }, [
            createElement('span', {
              style: {
                width: '80vw',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }
            }, [`${content.message}`]),
            createElement('feather', {
              props: {
                size: 16,
                type: 'chevron-right'
              }
            })
          ])
        }
      }],
      posts: []
    }
  },
  beforeCreate () {
    document.body.classList.remove('auth')
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${AllPosts}`
    }).then(({ data }) => {
      this.posts = data.posts
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  min-height: unset;
}

.icon-nav {
  padding-top: 3rem;
}
</style>
