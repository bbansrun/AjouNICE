<template>
  <article>
    <header>서비스 현황</header>
    <div class="content grid">
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="users" />
            <span>{{ 0 }}</span>
          </p>
          <p class="subtitle">
            {{ new Date().toLocaleDateString() }} 기준
          </p>
        </div>
        <div class="card-footer" />
      </div>
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="sticky-note" />
            <span>{{ 0 }}</span>
          </p>
          <p class="subtitle">
            {{ new Date().toLocaleDateString() }} 기준
          </p>
        </div>
        <div class="card-footer" />
      </div>
      <div class="card">
        <div class="card-content">
          <p class="title">
            <font-awesome-icon icon="users" />
            <span>{{ 0 }}</span>
          </p>
          <p class="subtitle">
            {{ new Date().toLocaleDateString() }} 기준
          </p>
        </div>
        <div class="card-footer" />
      </div>
    </div>
  </article>
</template>

<script>
export default {

}
</script>

<style>

</style>
