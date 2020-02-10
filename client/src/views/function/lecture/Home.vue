<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="강의평가"
      description="여러분의 수강후기를 공유해주세요."
      background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg"
    />
    <div class="container">
      <section class="search">
        <article>
          <header class="underline underline-inline-block">
            강의평 검색
          </header>
          <model-select
            v-model="item"
            :options="options"
            placeholder="학과/과목/교수명을 입력하거나 목록에서 선택해주세요."
          />
        </article>
      </section>
      <section class="recent-reviews">
        <article>
          <header class="underline underline-inline-block">
            주목받는 강의평
          </header>
        </article>
        <div class="reviews grid grid-auto">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="card"
          >
            <div class="card-content">
              <p class="title">
                {{ review.subject }}
              </p>
              <p class="subtitle">
                {{ review.professor }} | {{ review.dpt }} ({{ review.subType }})
              </p>
            </div>
            <div class="card-content">
              <p>{{ review.content }}</p>
            </div>
            <div class="card-footer">
              <span>
                <font-awesome-icon
                  v-for="n in review.rate"
                  :key="n"
                  icon="star"
                />
              </span>
            </div>
          </div>
        </div>
      </section>
      <div class="controls">
        <b-button
          tag="router-link"
          :to="evaluateLink"
        >
          강의평가 작성
        </b-button>
        <b-button
          tag="router-link"
          :to="myLectureReviewsLink"
        >
          나의 강의평가
        </b-button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import urljoin from 'url-join'
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

import Navigation from '@/components/base/Navigation.vue'
import Landing from '@/components/base/Landing.vue'
import Footer from '@/components/base/Footer.vue'

export default {
  components: {
    Navigation, Landing, Footer, ModelSelect
  },
  data () {
    return {
      reviews: [
        { id: 1, subject: '현대암호이론및응용', dpt: '사이버보안학과', subType: '전공필수', professor: '예홍진', rate: 5, content: '호호' },
        { id: 2, subject: '정보보호법정책과제도', dpt: '사이버보안학과', subType: '전공선택', professor: '박춘식', rate: 5, content: '호호' },
        { id: 3, subject: '컴퓨터네트워크', dpt: '소프트웨어학과', subType: '전공필수', professor: '강경란', rate: 5, content: '호호' },
        { id: 4, subject: '미디어통계', dpt: '미디어학과', subType: '전공필수', professor: '김효동', rate: 5, content: '호호' }
      ],
      scrollBase: null,
      options: [
        { value: '1', text: '사이버보안학과 | 현대암호이론및응용(예홍진)' },
        { value: '2', text: '소프트웨어학과 | 컴퓨터네트워크 (강경란)' },
        { value: '3', text: '소프트웨어학과 | 객체지향프로그래밍 (떼무)' },
        { value: '4', text: '소프트웨어학과 | 운영체제(고정길)' },
        { value: '5', text: '사이버보안학과 | 사이버보안사례특강(곽진)' }
      ],
      item: {
        value: '',
        text: ''
      }
    }
  },
  computed: {
    evaluateLink () {
      return urljoin(this.$route.path, '/evaluate')
    },
    myLectureReviewsLink () {
      return `/profile/${this.$store.state.user.idx}/lectures/reviews`
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom
  },
  methods: {
    reset () {
      this.item = {}
    },
    selectFromParentComponent1 () {
      // select option from parent component
      this.item = this.options[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-auto {
  display: grid;
  row-gap: .8rem;
  column-gap: .8rem;
}

.grid {
  padding: 0 2rem;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 1rem;
}

.controls {
  padding: 0 2rem;
  margin-bottom: 1rem;
}

svg {
  & path {
    fill: #ffd83d;
  }
}
</style>
