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
@import "~@/assets/styles/reset.scss";
@import "~@/assets/styles/fonts.scss";
@import "~@/assets/styles/index.scss";
@import "~@/assets/styles/media.scss";
@import "~@/assets/styles/keyframes.scss";
@import "~@/assets/styles/components/Button.scss";
@import "~@/assets/styles/components/Link.scss";
@import "~@/assets/styles/components/Form.scss";
#app {
    min-height: 100%;
    margin: 0 auto;
}
</style>
