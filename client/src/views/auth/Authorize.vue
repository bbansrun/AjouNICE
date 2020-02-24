<template>
  <div class="wrapper">
    <header data-logo>
      <h2>Authorize</h2>
      <small>계정 인증</small>
    </header>
    <article>
      <p class="has-text-centered">
        서비스 인증 처리중입니다...
      </p>
    </article>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { TokenAuthorization } from '@/assets/graphql/queries'
import { Authorize } from '@/assets/graphql/mutations'
export default {
  beforeCreate () {
    document.body.classList.add('auth')
    document.body.classList.add('loading')
  },
  created () {
    this.authorizeToken()
  },
  methods: {
    authorizeToken () {
      const params = this.$route.query
      if ('authToken' in params) {
        this.$apollo.query({
          query: gql`${TokenAuthorization}`,
          variables: {
            token: params.authToken
          }
        }).then(({ data: { checkTokenValid } }) => {
          const { user_idx, auth_email_yn } = checkTokenValid
          if (auth_email_yn === 'Y') {
            alert('유효하지 않은 토큰입니다.')
            this.$router.push('/error/403')
          } else {
            this.$apollo.mutate({
              mutation: gql`${Authorize}`,
              variables: {
                id: parseInt(user_idx),
                token: params.authToken
              }
            }).then(({ data: { authorize } }) => {
              if (authorize) {
                document.body.classList.remove('loading')
                this.flashSuccess('인증이 완료되었습니다. 로그인 후 사용가능합니다.')
                this.$router.push('/')
              }
            })
          }
        }).catch(error => {
          console.error(error)
          this.$router.push('/error/500')
        })
      } else {
        this.$router.push('/error/404')
      }
    }
  }
}
</script>
