<template>
    <section class="landing" :style="{ 'background': `url(${background}) center/cover fixed` }">
        <div class="cover"></div>
        <header>
            <h2 class="title" :class="{ 'logo-font': isLogo }">{{ title }}</h2>
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