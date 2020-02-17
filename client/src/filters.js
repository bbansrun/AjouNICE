// Vue.js Filters
// https://vuejs.org/v2/guide/filters.html

import Vue from 'vue'

const filters = {
  formatDateTime (timestamp) {
    const datetime = new Date(timestamp)
    return `${datetime.toLocaleDateString('ko-KR')} ${datetime.toLocaleTimeString('ko-KR')}`
  },
  numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  truncate (value, length) {
    return value.length > length ? value.subsr(0, length) + '...' : value
  }
}

// Register All Filters on import
Object.keys(filters).forEach(function (filterName) {
  Vue.filter(filterName, filters[filterName])
})
