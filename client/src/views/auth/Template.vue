<template>
  <div fix-page>
    <section data-form-center>
      <header>
        <h1 data-logo>
          AjouNICE!
        </h1>
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
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
