<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="아주맛집"
      description="여기여기, 아주맛집이야..."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <IconNav :data="boards" />
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { GourmetCategories } from '@/assets/graphql/queries'
import { Navigation, Landing, GourmetIconNav as IconNav, Footer } from '@/components'
export default {
  components: {
    Navigation,
    Landing,
    IconNav,
    Footer
  },
  data () {
    return {
      scrollBase: null
    }
  },
  apollo: {
    boards: {
      query: gql`${GourmetCategories}`
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
