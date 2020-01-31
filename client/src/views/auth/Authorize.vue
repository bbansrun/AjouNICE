<template>
  <div />
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'Authorize',
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
          query: gql`{ findUserByToken(token: "${params.authToken}") { user_idx auth_email_yn } }`
        }).then(result => {
          const { user_idx, auth_email_yn } = result.data.findUserByToken
          if (auth_email_yn === 'Y') {
            alert('유효하지 않은 토큰입니다.')
            window.location = '/error/401'
          } else {
            this.$apollo.mutate({
              mutation: gql`mutation { authorize(user_idx: ${user_idx}) }`
            }).then(result => {
              if (result.data.authorize) {
                window.location = '/'
              }
            })
          }
        }).catch(error => {
          console.error(error)
          window.location = '/error/500'
        })
      } else {
        window.location = '/error/404'
      }
    }
  }
}
</script>
