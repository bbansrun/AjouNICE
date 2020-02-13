
const { RedisCache, } = require('apollo-server-cache-redis');
const { LoggerExtension, } = require('apollo-server-logger');
const {
  ApolloServer,
  gql,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');

const http = require('http');
const NoIntrospection = require('graphql-disable-introspection');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule, } = require('graphql-validation-complexity');

const config = require('./config/config.json');
const typeDefs = gql(require('./typeDefs'));
const resolvers = require('./resolvers');
const { encodeTextBody, } = require('./middlewares/securityModule');
const app = require('./middlewares/app');
const db = require('./models');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    // NoIntrospection,
    depthLimit(5), // Limited GraphQL Query Depth
    createComplexityLimitRule(1000, { // Limited GraphQL Query Complexity
      onCost: cost => console.log(`[Apollo] Query Costs: ${cost}`),
    })
  ],
  engine: { // Connected to Apollo Engine
    apiKey: config.apollo.engine.key,
  },
  persistedQueries: { // Persisted Query
    cache: new RedisCache({
      host: config.development.redis_host,
    }),
  },
  cors: true, // CORS
  cacheControl: {
    defaultMaxAge: 10,
  },
  extensions: [() => new LoggerExtension({ // Logging
    tracing: true,
  })],
  context: async ({ req, }) => {
    // if (!req.headers.authorization) {
    //   throw new AuthenticationError('Resource 서버 접근을 위한 인증이 필요합니다.');
    // }
    // const token = req.headers.authorization.substr(7);
    return { db, };
  },
});

server.applyMiddleware({ app, cors: false, });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);
httpServer.listen(455);
httpServer.timeout = 5000; // Set Timeout under 5000ms
