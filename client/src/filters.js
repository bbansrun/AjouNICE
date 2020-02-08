// Vue.js Filters
// https://vuejs.org/v2/guide/filters.html

import Vue from 'vue'

const filters = {

  formatTimestamp (timestamp) {
    const datetime = new Date(timestamp)
    return datetime.toLocaleTimeString('ko-KR')
  }
}

// Register All Filters on import
Object.keys(filters).forEach(function (filterName) {
  Vue.filter(filterName, filters[filterName])
})
