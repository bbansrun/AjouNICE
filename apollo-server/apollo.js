
const { ApolloServer, gql } = require('apollo-server-express');
const { RedisCache } = require('apollo-server-cache-redis');
const app = require('./middlewares/app');
const server = new ApolloServer({
  typeDefs: gql(require('./typeDefs')),
  resolvers: require('./resolvers'),
  persistedQueries: {
    cache: new RedisCache({
        host: require('./config/config.json')['development']['redis_host']
    })
  },
});
server.applyMiddleware({ app, cors: false });
app.listen(455);
  
//   (app) => {
//     console.log('========================== AjouNICE! ==========================')
//     console.log(`🚀  GraphQL Server ready at ${app.address()}`)
// });