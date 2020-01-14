<template>
    <section id="error">
        <header id="error_code">
            <h1 data-logo>
                <span>X_X</span> | <span class="code" v-if="code">{{ code }}</span>
            </h1>
        </header>
        <div align="center" id="error_desc">
            <header>{{ description }}</header>
            <p>{{ sub_description }}</p>
            <a v-if="code == 500" href="mailto:team.ajounice@gmail.com">오류 리포트</a>
        </div>
        <nav id="error_nav">
            <router-link to="/" class="btn rounded-on-hover box-shadow-on-hover text-inverse">→ 처음으로</router-link>
        </nav>
        <div class="logo">
            <h2 data-logo>AjouNICE!</h2>
            <span text-divider>|</span>
            <span>아주대학교 커뮤니티 서비스</span>
        </div>
    </section>
</template>

<script>

export default {
  name: 'error',
  props: {
    description: String,
    sub_description: String,
    code: Number
  }
}
</script>

<style lang="scss" scoped>
.btn {
    padding: .6rem 3rem;
    margin-top: 1rem;
    background: #a18cd1;
    &:hover {
        color: #fff;
        background: purple;
    }
}
</style>
