<template>
  <div class="home">
    <HelloWorld msg="아주대학교 차세대 학부 커뮤니티 서비스"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">

</style>
