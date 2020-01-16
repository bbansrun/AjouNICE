<template>
    <div id="app">
        <Loading />
        <router-view />
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
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

</style>
