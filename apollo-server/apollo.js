
const { ApolloServer, gql, } = require('apollo-server-express');
const { RedisCache, } = require('apollo-server-cache-redis');
const { LoggerExtension, } = require('apollo-server-logger');
const app = require('./middlewares/app');

const server = new ApolloServer({
  typeDefs: gql(require('./typeDefs')),
  resolvers: require('./resolvers'),
  persistedQueries: {
    cache: new RedisCache({
      host: require('./config/config.json').development.redis_host,
    }),
  },
  cors: true,
  cacheControl: {
    defaultMaxAge: 10,
  },
  extensions: [() => new LoggerExtension({
    tracing: true,
  })],
  formatResponse: res => {
    res.hithisisnailer = 'hihi';
    return res;
  },
});
server.applyMiddleware({ app, cors: false, });
app.listen(455);

//   (app) => {
//     console.log('========================== AjouNICE! ==========================')
//     console.log(`🚀  GraphQL Server ready at ${app.address()}`)
// });
