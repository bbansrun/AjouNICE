<template>
    <div class="wrapper" fix-page>
        <flash-message></flash-message>
        <section data-form-center>
            <header>
                <h1 data-logo>AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form data-auth-form @submit.prevent autocomplete="off">
                <header data-logo>
                    <h2>LOGIN</h2>
                    <small>로그인</small>
                </header>
                <div class="input-form-wrapper">
                    <div class="input-form">
                        <input type="text" :class="{ 'error': this.errorValidation.userID && !this.userID }" placeholder="아이디" v-model="userID" pattern=".{6,}" required>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.userID && !this.userID }" v-if="this.errorValidation.userID && !this.userID">칸이 비어있습니다.</p>
                    </div>
                    <div class="input-form">
                        <input type="password" placeholder="패스워드" @keyup.enter="signin" v-model="password" pattern=".{8,}" :class="{ 'error': this.errorValidation.password && !this.password }" required>
                        <p class="auto-validate-noti" :class="{ 'error': this.errorValidation.password && !this.password }" v-if="this.errorValidation.password && !this.password">칸이 비어있습니다.</p>
                    </div>
                    <div class="input-form">
                        <input type="button" @click="signin" @submit.prevent value="로그인" />
                    </div>
                </div>
                <div class="input-form-controls">
                    <router-link to="/auth/reset" class="underline underline-inline-block">
                        <small>계정 재설정</small>
                    </router-link>
                    <router-link to="/auth/signup" class="btn rounded box-shadow text-inverse">회원가입 &rarr;</router-link>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import VueFlashMessage from 'vue-flash-message'
import gql from 'graphql-tag'

Vue.use(VueFlashMessage)

export default {
    name: 'login',
    data() {
        return {
            userID: '',
            password: '',
            errorValidation: {
                userID: false,
                password: false
            }
        }
    },
    methods: {
        signin() {
            let params = this.$route.params
            if (this.userID && this.password && this.password.length >= 8) {
                document.body.classList.toggle('loading')
                let userId = this.userID
                let password = this.password
                this.$store.dispatch('LOGIN', { userId, password })
                    .then(({ result }) => {
                        this.$Axios.get('https://api.ipify.org/?format=json').then(client => {
                            this.$apollo.mutate({
                                mutation: gql `mutation { lastLogin(userId: "${this.userID}", ip: "${client.data.ip}") }`
                            })
                        })
                        if (result.auth_email_yn === 'N') {
                            this.$store.dispatch('LOGOUT').then(() => {
                                window.location = '/error/401'
                            })
                        } else {
                            if ('redirect' in params) {
                                window.location = params['redirect']
                            } else {
                                window.location = '/home'
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        document.body.classList.toggle('loading')
                        this.$swal({
                            title: '오류!',
                            text: '입력하신 정보가 올바르지 않습니다.',
                            type: 'error',
                            width: '90vw'
                        })
                    })
            }
            if (!this.userID) {
                this.errorValidation.userID = true
            }
            if (!this.password) {
                this.errorValidation.password = true
            }
        }
    },
    beforeCreate() {
        document.body.classList.add('auth')
    },
}
</script>

<style lang="scss" scoped>
.btn {
    font-size: 1rem;
    margin-top: 1rem;
    padding: .5rem 4rem;
    background: #373B44;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #4286f4, #373B44);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #4286f4, #373B44); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
