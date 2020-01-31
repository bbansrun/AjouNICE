<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="학사일정"
      description="금년 학사일정입니다."
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <div class="container">
      <section class="schedule">
        <article>
          <header class="underline underline-inline-block">
            2020년도 학사일정
          </header>
          <b-table
            :columns="schedule.columns"
            :data="schedule.data"
          />
        </article>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import { Table } from 'buefy'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'

Vue.use(Table)
export default {
  components: {
    Navigation, Landing, Footer
  },
  data () {
    return {
      scrollBase: null,
      schedule: {
        columns: [
          { field: 'at', label: '일정' },
          { field: 'content', label: '내용' }
        ],
        data: [
          { at: '2019.12.24(화)~2019.12.31(화)', content: '복학생 전과신청' },
          { at: '2019.12.24.(화)~2020.1.15(수)', content: '1학기 1차 복학 신청' },
          { at: '2020.1.1(수)', content: '신정' },
          { at: '1.20(월)~1.22(수)', content: '1학기 예비 수강신청' },
          { at: '1.23(목)~1.31(금)', content: '1학기 최종 복학 신청' },
          { at: '1.24(금)~1.27(월)', content: '설 연휴' },
          { at: '2.10(월)~2.14(금)', content: '수강신청(재학생,복학생,재입학생)' },
          { at: '2.19(수)', content: '편입생 오리엔테이션' },
          { at: '2.21(금)', content: '전기 학위수여식' },
          { at: '2.24(월)', content: '입학식' },
          { at: '2.24(월)~2.28(금)', content: '1학기 등록' },
          { at: '2.25(화)', content: '편입생 수강신청' },
          { at: '2.28(금)', content: '신입생 수강신청' },
          { at: '3.1(일)', content: '삼일절' },
          { at: '3.2(월)', content: '1학기 개강' },
          { at: '3.2(월)~3.27(금)', content: '조기졸업 신청' },
          { at: '3.5(목)~3.6(금)', content: '1학기 수강정정' },
          { at: '3.19(목)~3.20(금)', content: '수강신청포기' },
          { at: '3.25(수) ~ 3.27(금)', content: '취득학점포기' },
          { at: '3.27(금)', content: '1학기 수업일수 1/4선' },
          { at: '3.27(금)~4.17(금)', content: '수업피드백(중간설문)' },
          { at: '4.12(일)', content: '47주년 개교기념일' },
          { at: '4.15(수)', content: '21대 국회의원선거' },
          { at: '4.20(월)~4.24(금)', content: '1학기 중간시험' },
          { at: '4.24(금)', content: '1학기 수업일수 1/2선' },
          { at: '4.30(목)', content: '석가탄신일' },
          { at: '5.4(월)~5.22(금)', content: '전공(제1전공·복수·부·연계)신청, 취소, 변경' },
          { at: '5.5(화)', content: '어린이날' },
          { at: '5.22(금)', content: '1학기 수업일수 3/4선' },
          { at: '5.25(월)~5.29(금)', content: '2학기 재학생 전과 신청' },
          { at: '6.1(월)~6.15(월)', content: '2학기 재입학 신청' },
          { at: '6.1(월)~6.26(금)', content: '1학기 수업평가' },
          { at: '6.3(수)~6.5(금)', content: '하계계절수업 수강신청' },
          { at: '6.6(토)', content: '현충일' },
          { at: '6.10(수)~6.12(금)', content: '하계계절수업 등록' },
          { at: '6.15(월)~6.19(금)', content: '1학기 기말시험' },
          { at: '6.15(월)~6.28(일)', content: '1학기 성적입력' },
          { at: '6.22(월)', content: '하계방학 시작, 2020-2학기 휴학·복학 신청 시작' },
          { at: '6.22(월)~6.26(금)', content: '2학기 복학생 전과신청' },
          { at: '6.22(월)~7.17(금)', content: '2학기 1차 복학 신청' },
          { at: '6.29(월)', content: '1학기 성적 공고일' },
          { at: '6.29(월)~7.17(금)', content: '하계 계절수업' },
          { at: '6.30(화)~7.1(수)', content: '1학기 성적 이의신청' },
          { at: '6.30(화)~7.2(목)', content: '1학기 성적 정정 및 최종제출' },
          { at: '7.1(수)~7.10(금)', content: '학사학위취득유예 신청, 복수·부·연계전공을 위한 졸업연기 신청' },
          { at: '7.22(수)~7.24(금)', content: '2학기 예비 수강신청' },
          { at: '7.25(토)~8.5(수)', content: '2학기 최종 복학 신청' },
          { at: '8.10(월)~8.14(금)', content: '2학기 수강신청(재학생,복학생,재입학생)' },
          { at: '8.15(토)', content: '광복절' },
          { at: '8.21(금)', content: '후기 학위수여식' },
          { at: '8.24(월)~8.28(금)', content: '2학기 등록' }
        ]
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
  }
}
</script>
