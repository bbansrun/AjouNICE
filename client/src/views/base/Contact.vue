<template>
    <div class="wrapper">
        <Landing title="연락" description="개발팀에 궁금한 것이 있으시면 연락주시기 바랍니다." background="http://www.ajou.ac.kr/_attach/new/_images/2019/12/23/191223_main_visual01.jpg" />
        <div class="container" data-form-wrapper>
            <section data-form>
                <form action="">
                    <div class="input-form-wrapper">
                        <div class="input-form">
                            <input type="text" v-model="name" name="name" id="name" placeholder="이름을 입력해주세요" required pattern=".{1,}" />
                        </div>
                        <div class="input-form">
                            <input type="email" v-model="email" name="email" id="email" placeholder="이메일 주소를 입력해주세요" required />
                        </div>
                    </div>
                </form>
            </section>
        </div>
        <Footer />
    </div>
</template>

<script>
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    name: 'contact',
    components: {
        Landing, Footer
    },
    data () {
        return {
            name: '',
            email: ''
        }
    }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/auth";
</style>