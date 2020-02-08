<template>
    <div class="home-slide">
        <a :href="link">
            <h2 :data-logo="isLargeTitleLogo">{{ largeTitle }}</h2>
            <p><small>{{ smallTitle }}</small></p>
        </a>
    </div>
</template>

<script>
export default {
  name: 'slide',
  props: {
    largeTitle: String,
    smallTitle: String,
    isLargeTitleLogo: Boolean,
    link: String
  }
}
</script>
