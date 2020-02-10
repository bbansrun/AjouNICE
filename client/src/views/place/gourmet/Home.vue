<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="아주맛집"
      description="여기여기, 아주맛집이야..."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <IconNav :data="iconNav" />
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import IconNav from '@/components/base/IconNav.vue'
import Footer from '@/components/base/Footer.vue'
export default {
  components: {
    Navigation,
    Landing,
    IconNav,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      iconNav: [
        { id: 1, title: '한식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 2, title: '일식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 3, title: '중식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 4, title: '양식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 5, title: '치킨', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 6, title: '피자', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 7, title: '족발&보쌈', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 8, title: '아시안&양식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 9, title: '도시락', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 10, title: '패스트푸드', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 11, title: '프랜차이즈', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 12, title: '야식', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 13, title: '찜&탕', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' },
        { id: 14, title: '맛집랭킹', background: 'https://pngimage.net/wp-content/uploads/2018/06/foods-icon-png-5.png', link: '/place/gourmet/category/' }
      ]
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
