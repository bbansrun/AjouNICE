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
      <div
        v-show="$store.state.user"
        class="broadcast"
      >
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
import Navigation from '@/components/base/Navigation.vue'
import Welcome from '@/components/base/Welcome.vue'
import IconNav from '@/components/base/IconNav.vue'
import PostList from '@/components/board/PostList.vue'
import Footer from '@/components/base/Footer.vue'
import { UserHome } from '@/assets/graphql/queries'
import { Notice } from '@/assets/graphql/mutations'

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
        { id: 5, title: '강의평가', background: 'https://image.flaticon.com/icons/png/512/234/234721.png', link: '/lectures' },
        { id: 6, title: '시간표', background: 'https://us.123rf.com/450wm/ankudi/ankudi1609/ankudi160900125/65803629-%ED%8F%89%EB%A9%B4-%EB%8B%AC%EB%A0%A5-%EC%95%84%EC%9D%B4%EC%BD%98-%EB%B9%88-%EC%9D%BC%EC%A0%95-%ED%85%9C%ED%94%8C%EB%A6%BF%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg?ver=6', link: '/timetable' },
        { id: 7, title: '부동산', background: 'https://download.seaicons.com/icons/fps.hu/free-christmas-flat-circle/512/home-icon.png', link: '/realty' },
        { id: 8, title: '도서관', background: 'https://www.theacademyofcreativity.org/webdata/uploaded/images/c08z4f2z03fz4bdzf94z298z6a1z66aze46z002z26.png', link: '/library' },
        { id: 9, title: '오늘의학식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/restaurant' }
      ],
      carouselItems: [
                `<a data-slide-item href="/">
                    <div class="cover"></div>
                    <div class="slide-content">
                        <h2 data-logo>AjouNICE!</h2>
                        <small>아주대학교의 대표 커뮤니티 서비스입니다.</small>
                    </div>
                </a>`
      ],
      carouselRadio: [],
      posts: []
    }
  },
  beforeCreate () {
    document.body.classList.remove('auth')
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${UserHome}`,
      variables: {
        id: this.$store.state.user.idx
      }
    }).then(({ data }) => {
      this.posts = data.posts
      for (const dpt of data.user.dpt_cd.split(',')) {
        this.$apollo.mutate({
          mutation: gql`${Notice}`,
          variables: {
            code: dpt
          }
        }).then(({ data }) => {
          const template = (id, message, link) => ({
            id: id,
            message: message,
            content (createElement, content) {
              return createElement('a', {
                attrs: {
                  href: link,
                  target: '_blank'
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
          })
          data.notice.forEach((value, i) => {
            this.carouselRadio.push(template(i, value.title, value.link))
          })
        })
      }
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
