<template>
    <div class="wrapper">
        <Navigation :scrollBase="scrollBase" />
        <Landing ref="scrollBase" :title="user_nm" background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg" />
        <div class="container"></div>
        <Footer />
    </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      user_nm: null
    }
  },
  beforeMount () {
    let _this = this
    this.$apollo.query({
      query: gql`{ findUserByIdx(user_idx: ${_this.$route.params.user_id}) { user_nm } }`
    }).then(result => {
      _this.user_nm = result.data.findUserByIdx.user_nm
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
