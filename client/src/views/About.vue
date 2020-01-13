<template>
    <div class="wrapper">
      <Landing title="AjouNICE!" description="아주나이스 서비스를 소개합니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual05_bg.gif" isLogo />
      <div class="container">
        <section class="about">
          <article>
            <header>정보공유에 차별점을 두어, </header>
            <p>이러쿵 저러쿵</p>
          </article>
          <hr />
          <h2>서비스 공지사항</h2>
          <table class="notice">
            <thead>
              <tr></tr>
            </thead>
            <tbody>
              <tr></tr>
            </tbody>
            <tfoot>
              <tr></tr>
            </tfoot>
          </table>
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