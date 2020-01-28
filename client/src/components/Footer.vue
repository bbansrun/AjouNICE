<template>
    <footer>
        <section class="wrapper">
            <div class="content">
                <header>
                    <h4 data-logo>AjouNICE!</h4>
                    <small>아주나이스는 아주대학교의 커뮤니티 서비스입니다.</small>
                </header>
                <ul class="copyright">
                    <li><router-link to="/about" class="underline">서비스소개</router-link></li>
                    <li><router-link to="/contact" class="underline">광고/제휴/기타문의</router-link></li>
                    <li><router-link to="/policy" class="underline">이용약관</router-link></li>
                    <li><router-link to="/sitemap" class="underline">사이트맵</router-link></li>
                </ul>
            </div>
            <hr />
            <p><span>&copy; {{ year }} <a id="bbansrun_bottom" target="_blank" href="http://github.com/bbansrun">bbansrun</a>. <br media />아주나이스의 모든 관련 권리는 bbansrun 팀에 있습니다.</span></p>
        </section>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            year: null
        }
    },
    mounted() {
        this.year = new Date().getUTCFullYear()
    }
}
</script>

<style lang="scss" scoped>
#bbansrun_bottom {
    transition: color .2s ease-out, font-weight .2s ease-out;
    &:hover {
        font-weight: bold;
        color: #667eea;
    }
}
</style>