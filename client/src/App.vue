<template>
    <div id="app">
        <Loading />
        <flash-message class="flash"></flash-message>
        <router-view />
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import 'vue-flash-message/dist/vue-flash-message.min.css'
export default {
  components: {
    Loading
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/fonts";
@import "~@/assets/styles/index";
@import "~@/assets/styles/media";
@import "~@/assets/styles/keyframes";
@import "~@/assets/styles/components/Button";
@import "~@/assets/styles/components/Link";
@import "~@/assets/styles/components/Form";

@import '~sweetalert2/src/variables';
@import '~sweetalert2/src/sweetalert2';
@import '~vue-select/src/scss/vue-select';

#app {
  min-height: 100%;
  margin: 0 auto;
}

.swal2-container.swal2-center {
  background: rgba(0, 0, 0, .65);
}

.flash {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 10000;
  > .flash__wrapper {
    box-shadow: 0 0 5px rgba(0, 0, 0, .65);
  }
}
</style>
