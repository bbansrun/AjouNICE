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
                </ul>
            </section>
            <hr />
            <p>
                <span>&copy; {{ year }} bbansrun.</span>
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