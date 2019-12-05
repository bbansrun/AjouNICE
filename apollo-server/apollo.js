
const { ApolloServer, gql } = require('apollo-server')
const { RedisCache } = require('apollo-server-cache-redis')
const server = new ApolloServer({
    typeDefs: gql(require('./typeDefs')),
    resolvers: require('./resolvers'),
    persistedQueries: {
        cache: new RedisCache({
            host: '127.0.0.1'
        })
    },
    cors: true
})

server.listen({ port: 5000 }).then(({ url }) => {
    console.log('========================== AjouNICE! ==========================')
    console.log(`🚀  GraphQL Server ready at ${url}`)
})