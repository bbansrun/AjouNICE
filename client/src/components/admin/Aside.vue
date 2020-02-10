<template>
  <aside>
    <div class="container">
      <header>
        <h2 data-logo>
          AjouNICE!
        </h2>
        <small>
          <strong>관리자</strong>
        </small>
      </header>
      사이드 영역
      <hr>
      <div class="controls">
        <a href="/#/">메인으로</a><br>
        <a @click="logout">로그아웃</a>
      </div>
    </div>
  </aside>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.container {
    padding: 1rem;
    > header {
        line-height: 1;
        text-align: center;
        margin-bottom: .5rem;
    }
}
</style>
