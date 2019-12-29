
const { ApolloServer, gql } = require('apollo-server')
const { RedisCache } = require('apollo-server-cache-redis')
const server = new ApolloServer({
    typeDefs: gql(require('./typeDefs')),
    resolvers: require('./resolvers'),
    persistedQueries: {
        cache: new RedisCache({
            host: require('./config/config.json')['development']['redis_host']
        })
    },
    cors: true
})

server.listen({ port: 455 }).then(({ url }) => {
    console.log('========================== AjouNICE! ==========================')
    console.log(`🚀  GraphQL Server ready at ${url}`)
})