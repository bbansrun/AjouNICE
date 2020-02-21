<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>2020년도 학사일정</strong>
        </header>
        <b-datepicker
            inline
            v-model="date"
            :events="events"
            :indicators="indicators"
            >
        </b-datepicker>
        
        <b-table
          :data="schedule.data"
          :loading="loading"
          :columns="schedule.columns"
        />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Schedule } from '@/assets/graphql/queries'
import { Navigation, Footer } from '@/components'
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
      },
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      events: [
        new Date(2020, 2, 1),
        new Date(2020, 2, 3),
        {
          date: new Date(2020, 2, 4),
          type: 'is-info'
        },
        new Date(2020, 2, 5),
        new Date(2020, 2, 7),
      ],
      bars: false
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
  computed: {
    indicators () {
      return this.bars ? 'bars' : 'dots'
    }
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

<style>
.table {
  font-family: 'KoPub Dotum';
}
</style>
