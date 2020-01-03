<template>
  <div class="introduction">
    <header>홈</header>
    <hr />
    <article>
      <header>금일의 핫이슈</header>
      <div class="card">
        <h3>프로젝트 도중에 빤스런한 NN학번 *** 학생</h3>
        <img src="http://placehold.it/50x50" />
        <div class="card-footer">좋아요 -28개 죽창 100개</div>
      </div>
    </article>
    <hr />
    <p>
      <h2>아주나이스에 관하여</h2>
      <a href="mailto:jwurbane97@ajou.ac.kr">의견 있으신 경우 메일을 주시면 감사하겠습니다.</a>
    </p>
    <hr>
    <div class="test_area" data-description="notice_crawl_test">
      <a @click.prevent="fetchResource">학교 메인페이지 공지사항</a>
      <div data-for="notice">
        <div v-for="r in this.resources" :key="r.link" class="card">{{ r.title }}</div>
      </div>
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
header {
  font-size: 3rem;
  font-weight: bold;
  opacity: .3;
}
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
div.card {
  box-shadow: 0 0 5px rgba(0,0,0,.5);
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
}
</style>
