<template>
    <div class="loader">
        <div class="wrapper">
            <div class="logo">
                <img src="/AjouNICE.png" alt="AjouNICE!" />
            </div>
            <p>필요한 데이터를 준비하고 있습니다...</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading'
}
</script>

<style lang="scss">
body.loading .loader {
    animation: unset;
    border-radius: unset;
}
</style>