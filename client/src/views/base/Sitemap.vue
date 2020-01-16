<template>
    <div class="wrapper">
        <Landing title="사이트맵" description="아주나이스 전체 페이지 구성을 보여드립니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/31/191231_main_visual01.jpg" />
        <div class="container">
            <article class="sitemap-wrapper">
                <header class="underline underline-inline-block">사이트맵</header>
                <div class="sitemap">
                    <router-link to="/">홈</router-link>
                </div>
            </article>
        </div>
        <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
 components: {
     Landing, Footer
 }   
}
</script>