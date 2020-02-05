
const { ApolloServer, gql, } = require('apollo-server-express');
const { RedisCache, } = require('apollo-server-cache-redis');
const { LoggerExtension, } = require('apollo-server-logger');

const { encodeTextBody, } = require('./middlewares/securityModule');
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
  context: ({ req, res, }) => {
    return {
      req, res,
    };
  },
  formatResponse: async res => {
    try {
      let type = 'application/json';
      if (res.graphqlWasEncoded) {
        res.data = await encodeTextBody(res.data); // encoding
        type = 'text/plain';
        res.setHeader('content-transfer-encoding', 'base64');
      }
      res.setHeader('content-type', type);
      res.setHeader(
        'content-length',
        Buffer.byteLength(res, 'utf8').toString()
      );
      return res;
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', Buffer.byteLength(res, 'utf8').toString());
      return res;
    }
  },
});
server.applyMiddleware({ app, cors: false, });
app.listen(455);
