<template>
  <nav class="icon-nav">
    <div
      v-for="icon in data"
      :key="icon.category_idx"
      class="icon-wrapper"
    >
      <router-link :to="`/place/gourmet/${icon.title}`">
        <div
          class="icon"
          :style="{ 'background': `url('http://placehold.it/200x200') center/cover` }"
        />
        <p>{{ icon.category_nm }}</p>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>
