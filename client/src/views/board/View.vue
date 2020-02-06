<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      :title="title"
      description=""
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div
      class="container"
      v-html="body"
    />
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
import { Post } from '@/assets/graphql/queries'
export default {
  name: 'App',
  components: {
    Navigation,
    Landing,
    Footer
  },
  data () {
    return {
      scrollBase: null,
      title: '',
      meta: {},
      body: ''
    }
  },
  beforeCreate () {
    this.$apollo.query({
      query: gql`${Post}`,
      variables: {
        id: this.$route.params.post_id
      }
    }).then(({ data }) => {
      this.title = data.post.title
      this.body = data.post.body
    }).catch(error => {
      console.error(error)
      // window.location = '/error/404'
    })
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
