<template>
  <section
    v-if="items && items.length > 0"
    class="gourmets"
  >
    <router-link
      v-for="item in items"
      :key="item.node.res_idx"
      :to="`/place/gourmet/${item.node.res_idx}/view`"
    >
      <article class="gourmet">
        <header>
          <div class="wrapper">
            <h3>{{ item.node.res_nm }}</h3>
            <div class="meta">
              <div class="info">
                <span>
                  <small>{{ item.node.desc }}</small>
                </span>
              </div>
              <div class="info">
                <span>
                  <small>{{ item.node.res_info }}</small>
                </span>
              </div>
              <div class="ratings">
                <b-rate
                  v-model="item.node.star_avg"
                  :max="5"
                  :show-score="true"
                  :rtl="false"
                  :spaced="false"
                  :disabled="true"
                />
              </div>
            </div>
          </div>
        </header>
        <div class="thumbnail">
          <figure>
            <img
              :src="item.node.res_icon"
              :alt="`${res_nm}`"
            >
          </figure>
        </div>
      </article>
    </router-link>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.gourmets {
  > a {
    > .gourmet {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto;
      > .thumbnail {
        position: relative;
        > figure {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: unset;
          max-height: unset;
        }
      }
    }
  }
}
</style>
