<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="AjouNICE!"
      description="아주나이스 서비스를 소개합니다."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif"
      is-logo
    />
    <main>
      <div class="wrapper container">
        <section class="about">
          <header>
            <strong>차세대 학부 커뮤니티 서비스를 지향합니다.</strong>
          </header>
          <p>Mobile First와 정보공유에 초점을 두고 개발된 프로젝트입니다.</p>
          <hr>
          <header class="underline underline-inline-block">
            <strong>서비스 공지사항</strong>
          </header>
          <b-table
            :data="data"
            :loading="loading"

            paginated
            backend-pagination
            :total="total"
            :per-page="perPage"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            backend-sorting

            :default-sort-direction="defaultSortOrder"
            :default-sort="[sortField, sortOrder]"
            @page-change="onPageChange"
            @sort="onSort"
          >
            <template slot-scope="props">
              <b-table-column
                field="original_title"
                label="Title"
                sortable
              >
                {{ props.row.original_title }}
              </b-table-column>

              <b-table-column
                field="vote_average"
                label="Vote Average"
                numeric
                sortable
              >
                <span
                  class="tag"
                  :class="type(props.row.vote_average)"
                >
                  {{ props.row.vote_average }}
                </span>
              </b-table-column>

              <b-table-column
                field="vote_count"
                label="Vote Count"
                numeric
                sortable
              >
                {{ props.row.vote_count }}
              </b-table-column>

              <b-table-column
                field="release_date"
                label="Release Date"
                sortable
                centered
              >
                {{ props.row.release_date ? new Date(props.row.release_date).toLocaleDateString() : '' }}
              </b-table-column>

              <b-table-column
                label="Overview"
                width="500"
              >
                {{ props.row.overview | truncate(80) }}
              </b-table-column>
            </template>
          </b-table>
          </strong>
          </header></strong>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'
export default {
  components: {
    Navigation, Landing, Footer
  },
  filters: {
    truncate (value, length) {
      return value.length > length
        ? value.substr(0, length) + '...'
        : value
    }
  },
  data () {
    return {
      scrollBase: null,
      data: [],
      total: 0,
      loading: false,
      sortField: 'vote_count',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    this.loadAsyncData()
  },
  methods: {
    loadAsyncData () {
      const params = [
        'api_key=bb6f51bef07465653c3e553d6ab161a8',
        'language=en-US',
        'include_adult=false',
        'include_video=false',
            `sort_by=${this.sortField}.${this.sortOrder}`,
            `page=${this.page}`
      ].join('&')

      this.loading = true
      this.$Axios.get(`https://api.themoviedb.org/3/discover/movie?${params}`)
        .then(({ data }) => {
          // api.themoviedb.org manage max 1000 pages
          this.data = []
          let currentTotal = data.total_results
          if (data.total_results / this.perPage > 1000) {
            currentTotal = this.perPage * 1000
          }
          this.total = currentTotal
          data.results.forEach((item) => {
            item.release_date = item.release_date.replace(/-/g, '/')
            this.data.push(item)
          })
          this.loading = false
        })
        .catch((error) => {
          this.data = []
          this.total = 0
          this.loading = false
          throw error
        })
    },
    onPageChange (page) {
      this.page = page
      this.loadAsyncData()
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.loadAsyncData()
    },
    type (value) {
      const number = parseFloat(value)
      if (number < 6) {
        return 'is-danger'
      } else if (number >= 6 && number < 8) {
        return 'is-warning'
      } else if (number >= 8) {
        return 'is-success'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  padding: 0 2rem;
  & header {
    font-weight: bold;
    font-size: 1.5rem;
  }
}
</style>
