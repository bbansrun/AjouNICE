<template>
  <div class="wrapper">
    <!-- <Navigation is-static /> -->
    <InfinitySwipe
      class="categories"
      :current-page="activeCategory"
    >
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="infinity-swipe-item"
      >
        <a
          :class="{'active': activeCategory == category.category_idx}"
          @click="onCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </a>
      </div>
    </InfinitySwipe>
    <InfinitySwipe
      class="categories sub_categories"
      :current-page="activeSubCategory"
    >
      <div
        v-for="(category, index) in getChildCategories[0].childCategories"
        :key="index"
        class="infinity-swipe-item"
      >
        <a
          :class="{'active': activeSubCategory == category.category_idx}"
          @click="onSubCategoryClicked(category.category_idx)"
        >
          {{ category.category_nm }}
        </a>
      </div>
    </InfinitySwipe>
    <div class="container">
      <Posts :cate-idx="parseInt(activeSubCategory)" />
    </div>
    <Footer />
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { Navigation, Posts, Footer } from '@/components'
import { Categories } from '@/assets/graphql/queries'
import InfinitySwipe from 'vue-swipe-menu'
import 'vue-swipe-menu/dist/vue-swipe-menu.css'
export default {
  components: {
    Navigation,
    Posts,
    Footer,
    InfinitySwipe
  },
  data () {
    return {
      scrollBase: null,
      posts: [],
      navCategories: [],
      title: '게시판',
      desc: '아주나이스 커뮤니티',
      activeCategory: 2,
      activeSubCategory: 3
    }
  },
  apollo: {
    categories: {
      query: gql`${Categories}`,
      variables: {
        type: 'NORMAL',
        depth: 0
      }
    }
  },
  computed: {
    getChildCategories () {
      _.filter()
      return _.filter(this.categories, (item) => (item.category_idx == this.activeCategory))
    }
  },
  watch: {
    activeCategory (value) {
      const childCates = _.filter(this.categories, (item) => (item.category_idx == this.activeCategory))[0].childCategories
      if (childCates.length === 0) {
        this.activeSubCategory = value
      } else {
        this.activeSubCategory = parseInt(childCates[0].category_idx)
      }
    }
  },
  methods: {
    onCategoryClicked (index) {
      this.activeCategory = parseInt(index)
    },
    onSubCategoryClicked (index) {
      this.activeSubCategory = parseInt(index)
    }
  }
}
</script>

<style lang="scss">
.categories {
  width: 100vw;
  background: #6400FF;
  color: #fff;
  &.sub_categories {
    background: red;
  }
  & .infinity-swipe-item {
    padding: .5rem 0;
    > a {
      display: inline-block;
      font: {
        size: 1.6rem;
      }
      margin: 0 15px;
      color: #fff;
      &.active {
        text-shadow: 0 0 5px rgba(0,0,0,.5);
      }
      &:not(.active) {
        font: {
          weight: 100;
        }
        opacity: .4;
      }
    }
  }
}
</style>
