<template>
  <div class="home">
    <nav class="gnb">
      <div class="logo">
        <h1>AjouNICE!</h1>&nbsp;|&nbsp;<span>아주대학교 차세대 커뮤니티 서비스</span>
      </div>
    </nav>
    <div class="container">
      <AjouNICE />
    </div>
    <a href="https://github.com/bbansrun/AjouNICE">
      <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub">
    </a>
    <footer class="card">
      <article>
        <header>
          <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" alt="Bbansrun">
        </header>
        <div class="wrapper">
          <span>
            <strong><a href="http://github.com/bbansrun">팀 빤스런</a></strong>
          </span>
          <p>
            <ul>
              <li>김호영</li>
              <li>최성흠</li>
              <li>전지원</li>
              <li>오현희</li>
            </ul>
          </p>
        </div>
      </article>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
import AjouNICE from '@/components/AjouNICE.vue'

export default {
  name: 'home',
  components: {
    AjouNICE
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
</style>