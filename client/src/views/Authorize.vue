<template>
    <div></div>
</template>

<script>
import gql from 'graphql-tag'
export default {
    name: 'authorize',
    methods: {
        authorizeToken () {
            let params = this.$route.query
            if ('authToken' in params) {
                this.$apollo.query({
                    query: gql`{ findUserByToken(token: "${params['authToken']}") { user_idx } }`
                }).then(result => {
                    let user_idx = result.data.findUserByToken.user_idx
                    this.$apollo.mutate({
                        mutation: gql`mutation { authorize(user_idx: ${user_idx}) }`
                    }).then(result => {
                        if (result.data.authorize) {
                            window.location = '/'
                        }
                    })
                })
            } else {
                window.location = '/error/404'
            }
        }
    },
    beforeCreate () {
        document.body.classList.toggle('loading')
    },
    created () {
        this.authorizeToken()
    }
}
</script>