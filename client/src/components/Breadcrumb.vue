<template>
  <ul class="breadcrumb">
    <li
      v-for="label in labels"
      :key="label"
    >
      <router-link to="">
        {{ label }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    links: Array,
    labels: Array
  }
}
</script>
