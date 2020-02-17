<template>
  <div />
</template>

<script>
import gql from 'graphql-tag'
import { TokenAuthorization } from '@/assets/graphql/queries'
import { Authorize } from '@/assets/graphql/mutations'
export default {
  beforeCreate () {
    document.body.classList.toggle('loading')
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
            this.$router.push('/error/401')
          } else {
            this.$apollo.mutate({
              mutation: gql`${Authorize}`,
              variables: {
                id: user_idx
              }
            }).then(({ data: { authorize } }) => {
              if (authorize) {
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
