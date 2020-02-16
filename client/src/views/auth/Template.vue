<template>
  <main fix-page>
    <section
      data-form-center
      class="auth has-text-centered"
    >
      <header>
        <Logo />
        <small>아주대학교 대표 커뮤니티 서비스</small>
      </header>
      <form
        data-auth-form
        autocomplete="off"
        @submit.prevent
      >
        <router-view />
      </form>
    </section>
  </main>
</template>

<script>
import Logo from '@/assets/images/AjouNICE_shadow.svg'
export default {
  components: {
    Logo
  }
}
</script>

<style>

</style>
