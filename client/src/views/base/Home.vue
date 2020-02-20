<template>
  <div class="home">
    <Navigation :scroll-base="scrollBase" />
    <main>
      <Popup />
      <carousel
        ref="scrollBase"
        :data="carouselItems"
      />
      <Welcome
        :name="user.user_nm"
        :idx="parseInt(user.user_idx)"
      />
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
    </main>
    <Footer />
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import gql from 'graphql-tag'
import { Navigation, Welcome, IconNav, Footer, PostList, Popup } from '@/components'
import { UserHome, Notice } from '@/assets/graphql/queries'

export default {
  components: {
    Navigation,
    Welcome,
    IconNav,
    PostList,
    Footer,
    Popup
  },
  data () {
    return {
      scrollBase: null,
      user: {
        user_nm: '',
        idx: null
      },
      iconNav: [
        {
          id: uuid(),
          title: '커뮤니티',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/board/'
        },
        {
          id: uuid(),
          title: '학사일정',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/schedule'
        },
        {
          id: uuid(),
          title: 'Ajou버스',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/place/bus'
        },
        {
          id: uuid(),
          title: '아주맛집',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/place/gourmet'
        },
        {
          id: uuid(),
          title: '강의평가',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/lectures'
        },
        {
          id: uuid(),
          title: '시간표',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/timetable'
        },
        {
          id: uuid(),
          title: '부동산',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/place/realty'
        },
        {
          id: uuid(),
          title: '도서관',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/place/library'
        },
        {
          id: uuid(),
          title: '오늘의학식',
          background: 'https://avatars3.githubusercontent.com/u/51874554?s=200&v=4',
          link: '/restaurant'
        }
      ],
      carouselItems: [
        `<a data-slide-item href="/#/">
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
    if (this.$store.state.user) {
      this.$apollo.query({
        query: gql`${UserHome}`,
        variables: {
          id: this.$store.state.user.idx
        }
      }).then(({ data: { user, posts } }) => {
        this.posts = posts
        this.user = user
        for (const dpt of user.dpt_cd.split(',')) {
          this.$apollo.query({
            query: gql`${Notice}`,
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
    }
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

<style>
.broadcast-content {
  font-family: 'KoPub Dotum';
}
</style>
