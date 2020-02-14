<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper">
        <section class="schedule container">
          <header class="underline underline-inline-block underline-animated">
            <strong>2020년도 학사일정</strong>
          </header>
          <b-table
            :data="schedule.data"
            :loading="loading"
            :columns="schedule.columns"
          />
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import { Table } from 'buefy'
import Navigation from '@/components/base/Navigation.vue'
import Footer from '@/components/base/Footer.vue'

import gql from 'graphql-tag'
import { Schedule } from '@/assets/graphql/queries'

Vue.use(Table)
export default {
  components: {
    Navigation,
    Footer
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
  beforeMount () {
    document.body.classList.add('loading')
  },
  mounted () {
    document.body.classList.remove('loading')
    this.loadSchedule()
  },
  beforeUpdate () {
    document.body.classList.add('loading')
  },
  updated () {
    document.body.classList.remove('loading')
  },
  methods: {
    loadSchedule () {
      this.loading = true
      this.$apollo.query({
        query: gql`${Schedule}`
      }).then(({ data }) => {
        this.loading = false
        this.schedule.data = data.schedule
      }).catch(error => {
        console.error(error)
        this.$router.push('/error/500')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
tr {
  & td::before {
    white-space: nowrap;
  }
}
</style>
