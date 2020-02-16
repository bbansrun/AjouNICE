<template>
  <nav class="icon-nav">
    <div
      v-for="icon in data"
      :key="icon.id"
      class="icon-wrapper"
    >
      <router-link :to="icon.link">
        <div
          class="icon"
          :style="{ 'background': `url(${icon.background}) center/cover` }"
        />
        <p>{{ icon.title }}</p>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>
