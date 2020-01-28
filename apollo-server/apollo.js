
const { ApolloServer, gql } = require('apollo-server')
const { LoggerExtension } = require('apollo-server-logger')
const { RedisCache } = require('apollo-server-cache-redis')
const server = new ApolloServer({
  typeDefs: gql(require('./typeDefs')),
  resolvers: require('./resolvers'),
  persistedQueries: {
    cache: new RedisCache({
      host: require('./config/config.json').development.redis_host
    })
  },
  cors: true,
  cacheControl: {
    defaultMaxAge: 10
  },
  extensions: [() => new LoggerExtension({
    tracing: true
  })],
  context: ({ req, res }) => {
    // const token = req.headers.authorization || ''
    // Get User JWT Token
    // const user = getUser(token)
    // if (!user) throw new AuthenticationError('You must be signed in')
    // return { user }
  }
})

server.listen({ port: 455 }).then(({ url }) => {
  console.log('========================== AjouNICE! ==========================')
  console.log(`🚀  GraphQL Server ready at ${url}`)
})
