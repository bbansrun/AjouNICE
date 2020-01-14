<template>
    <section class="landing" :style="{ 'background': `url(${background}) center/cover fixed` }">
        <div class="cover"></div>
        <header>
            <h2 class="title" :data-logo="isLogo">
                <span class="underline underline-animated underline-inline-block">{{ title }}</span>
            </h2>
            <small>{{ description }}</small>
        </header>
    </section>
</template>

<script>
export default {
    name: 'landing',
    props: {
        title: String,
        description: String,
        background: String,
        isLogo: Boolean
    }
}
</script>

<style lang="scss" scoped>
.underline {
    &::before {
        background: #17553E;
    }
}
</style>