<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="한식"
      description="아주대학교 인근 한식 맛집을 소개합니다."
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <article>
        <header class="underline underline-inline-block">리스트</header>
        <b-table :data="data">
          <template slot-scope="props">
                <b-table-column field="id" label="ID" width="40" numeric>
                  <span>{{ props.row.id }}</span>
                </b-table-column>
                <b-table-column field="thumbnail" label="이미지" width="40" numeric>
                  <img :src="props.row.thumbnail" />
                </b-table-column>
                <b-table-column field="title" label="업소명" width="40">
                  <router-link :to="gourmetPlaceDetailLink(props.row.id)">{{ props.row.title }}</router-link>
                </b-table-column>
                <b-table-column field="type" label="유형" width="40">
                  <span>한식</span>
                </b-table-column>
                <b-table-column field="date" label="작성일" width="40" centered>
                  {{ new Date(props.row.date).toLocaleDateString() }}
                </b-table-column>
            </template>
        </b-table>
      </article>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import urljoin from 'url-join'
import { Table } from 'buefy'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'

Vue.use(Table)
export default {
  components: {
    Navigation, Landing, Footer
  },
  data () {
    return {
      scrollBase: null,
      data: [
        { id: 1, thumbnail: 'http://placehold.it/100x100', title: '아맛집', type: '한식', date: Date.now() }
      ]
    }
  },
  computed: {
    gourmetPlaceDetailLink () {
      return (id) => (urljoin(this.$route.path, `/${id}`))
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
