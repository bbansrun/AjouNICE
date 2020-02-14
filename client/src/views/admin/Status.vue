<template>
  <section class="status">
    <header class="underline underline-inline-block underline-animated">
      <strong>서비스 현황</strong>
    </header>
    <div class="content grid">
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="users" />&nbsp;
            <span>{{ userCnt }}</span>
          </p>
          <p class="subtitle">
            <small>{{ new Date() | moment('YYYY-MM-DD HH:mm') }} 기준</small>
          </p>
        </div>
        <div class="card-footer" />
      </div>
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="sticky-note" />&nbsp;
            <span>{{ postCnt }}</span>
          </p>
          <p class="subtitle">
            <small>{{ new Date() | moment('YYYY-MM-DD HH:mm') }} 기준</small>
          </p>
        </div>
        <div class="card-footer" />
      </div>
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="users" />&nbsp;
            <span>{{ 0 }}</span>
          </p>
          <p class="subtitle">
            <small>{{ new Date() | moment('YYYY-MM-DD HH:mm') }} 기준</small>
          </p>
        </div>
        <div class="card-footer" />
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import moment from 'vue-moment'
import gql from 'graphql-tag'
import { AdminStatus } from '@/assets/graphql/queries'

Vue.use(moment)
export default {
  data () {
    return {
      userCnt: 0,
      postCnt: 0
    }
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${AdminStatus}`
    }).then(({ data: { users, posts } }) => {
      this.userCnt = users.length
      this.postCnt = posts.length
    })
  }
}
</script>
