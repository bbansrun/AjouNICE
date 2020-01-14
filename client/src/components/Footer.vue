<template>
    <footer class="footer">
        <div class="footer-wrapper">
            <section class="footer">
                <header>
                    <h2 class="logo-font">AjouNICE!</h2>
                    <small>아주대학교 학부 커뮤니티 서비스</small>
                </header>
                <ul class="copyright">
                    <li>
                        <router-link to="/about">서비스소개</router-link>
                    </li>
                    <li>
                        <router-link to="/contact">연락</router-link>
                    </li>
                    <li>
                        <router-link to="/policy">이용약관</router-link>
                    </li>
                    <li>
                        <router-link to="/sitemap">사이트맵</router-link>
                    </li>
                </ul>
            </section>
            <hr />
            <p>
                <span>&copy; {{ year }} <a target="_blank" href="http://github.com/bbansrun">bbansrun</a>. 아주나이스의 모든 관련 권리는 bbansrun 팀에 있습니다.</span>
            </p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'footer',
    data () {
        return {
            year: null
        }
    },
    mounted () {
        this.year = new Date().getUTCFullYear()
    }
}
</script>