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
        <router-link to="/">
          메인으로
        </router-link><br>
        <a @click="logout">
          <font-awesome-icon icon="sign-out-alt" />&nbsp;
          <span>로그아웃</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('LOGOUT').then(() => {
        document.body.classList.toggle('loading')
        this.$router.push('/')
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
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
