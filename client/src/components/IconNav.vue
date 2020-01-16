<template>
    <nav class="icon-nav">
        <div class="icon-wrapper" v-for="icon in data" :key="icon.id">
            <router-link :to="icon.link">
                <div class="icon" :style="{ 'background': `url(${icon.background}) center/cover` }"></div>
                <p>{{ icon.title }}</p>
            </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'icon_nav',
    props: {
        data: Array
    }
}
</script>