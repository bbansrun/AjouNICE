
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
  cors: true,
  context: ({ req }) => {
    try {
      if (req.get("content-transfer-encoding") === "base64") {
        const str = await decodeTextBody(req.body); // decoding
        req.body = JSON.parse(str);
        req.headers["content-type"] = "application/json";
        req.graphqlWasEncoded = true;
      }
    } catch (e) {
      throw new Error(e);
    }
  },
})

server.listen({ port: 455 }).then(({ url }) => {
    console.log('========================== AjouNICE! ==========================')
    console.log(`🚀  GraphQL Server ready at ${url}`)
})