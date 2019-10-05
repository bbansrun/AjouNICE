<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>본 프로젝트는 Vue.js + Flask를 기반으로 개발됩니다.</p>
    <hr />
    <footer>
      <header><strong><a href="http://github.com/bbansrun">팀 빤스런</a></strong></header>
      <ul>
        <li>김호영</li>
        <li>최성흠</li>
        <li>전지원</li>
        <li>오현희</li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
