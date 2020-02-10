
const { RedisCache, } = require('apollo-server-cache-redis');
const { LoggerExtension, } = require('apollo-server-logger');
const { ApolloServer, gql, } = require('apollo-server-express');

const http = require('http');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule, } = require('graphql-validation-complexity');

const config = require('./config/config.json');
const typeDefs = gql(require('./typeDefs'));
const resolvers = require('./resolvers');
const { encodeTextBody, } = require('./middlewares/securityModule');
const app = require('./middlewares/app');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
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
  context: async ({ req, connection, }) => {
    if (connection) {
      return connection.context;
    } else {
      const token = req.headers.Authorization || ''; // jwt decode 후 User에서 해당 User 찾아 currentUser return
      return { token, };
    }
  },
});

server.applyMiddleware({ app, cors: false, });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);
httpServer.listen(455);
