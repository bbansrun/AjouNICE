<template>
  <div class="introduction">
    <p><strong>아주대학교의 새로운 커뮤니티 서비스를 기대해주세요! 서비스 기능, 운영 등에 관한 의견을 받습니다.</strong></p>
    <p><a href="mailto:jwurbane97@ajou.ac.kr">의견 있으신 경우 메일을 주시면 감사하겠습니다.</a></p>
    <hr>
    <div class="test_area" data-description="notice_crawl_test">
      <a @click.prevent="fetchResource">학교 메인페이지 공지사항</a>
      <ul data-for="notice">
        <li v-for="r in this.resources" :key="r.link">{{ r.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $backend from '../backend'
export default {
  name: 'ajounice',
  props: {
    msg: String
  },
  data () {
    return {
      resources: null,
      error: ''
    }
  },
  methods: {
    fetchResource () {
      $backend.fetchResource()
        .then(responseData => {
          this.resources = responseData.result
        }).catch(error => {
          this.error = error.message
        })
    },
    fetchSecureResource () {
      $backend.fetchSecureResource()
        .then(responseData => {
          this.resources.push(responseData)
        }).catch(error => {
          this.error = error.message
        })
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
