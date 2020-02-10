<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="학사일정"
      description="금년 학사일정입니다."
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <section class="schedule">
        <article>
          <header class="underline underline-inline-block">
            2020년도 학사일정
          </header>
          <b-table
            :data="schedule.data"
            :loading="loading"

            :columns="schedule.columns"
          />
        </article>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import { Table } from 'buefy'
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'
import { Schedule } from '@/assets/graphql/queries'

Vue.use(Table)
export default {
  components: {
    Navigation, Landing, Footer
  },
  data () {
    return {
      scrollBase: null,
      loading: false,
      schedule: {
        columns: [
          { field: 'date', label: '일정' },
          { field: 'event', label: '내용' },
          { field: 'etc', label: '비고' }
        ],
        data: []
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    this.loadSchedule()
  },
  methods: {
    loadSchedule () {
      this.loading = true
      this.$apollo.query({
        query: gql`${Schedule}`
      }).then(({ data }) => {
        this.loading = false
        this.schedule.data = data.schedule
      })
    }
  }
}
</script>
