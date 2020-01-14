<template>
    <div class="wrapper">
      <Landing title="AjouNICE!" description="아주나이스 서비스를 소개합니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif" isLogo />
      <div class="container">
        <section class="about">
          <article>
            <header>차세대 학부 커뮤니티 서비스를 지향합니다.</header>
            <p>Mobile First와 정보공유에 초점을 두고 개발된 프로젝트입니다.</p>
          </article>
          <hr />
          <article>
            <header>
              <span>서비스 공지사항</span>
            </header>
            <table class="notice">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>유형</th>
                  <th>제목</th>
                  <th>일시</th>
                  <th>작성</th>
                  <th>조회</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>공지</td>
                  <td>서비스 소개</td>
                  <td>2020. 1. 1.</td>
                  <td>빤스런 팀</td>
                  <td>100</td>
                </tr>
              </tbody>
              <tfoot>
                <tr></tr>
              </tfoot>
            </table>
          </article>
        </section>
      </div>
      <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'about',
  components: {
    Landing, Footer
  },
  data () {
    return {
      columns: ['id', 'name', 'age'],
      tableData: [
          { id: 1, name: "John", age: "20" },
          { id: 2, name: "Jane", age: "24" },
          { id: 3, name: "Susan", age: "16" },
          { id: 4, name: "Chris", age: "55" },
          { id: 5, name: "Dan", age: "40" }
      ],
      options: {}
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
    & span {
      position: relative;
      &::before {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          z-index: -1;
          bottom: 1px;
          height: 10px;
          background-color: #667eea;
          transition: all .4s cubic-bezier(0.57, 0.02, 0.06, 1);
          width: 100%;
      }
    }
  }
}
</style>