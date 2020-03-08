const http = require('http');
const colors = require('colors');
const config = require('./config/config.json');

const app = require('./middlewares/app');
const { LoggerExtension, } = require('apollo-server-logger');
const { RedisCache, } = require('apollo-server-cache-redis');
const {
  ApolloServer,
  gql,
} = require('apollo-server-express');

const db = require('./models');
const typeDefs = gql(require('./typeDefs'));
const resolvers = require('./resolvers');

const NoIntrospection = require('graphql-disable-introspection');
const { encodeTextBody, } = require('./middlewares/securityModule');
const depthLimitRule = require('graphql-depth-limit');
const { createComplexityLimitRule, } = require('graphql-validation-complexity');
const depthLimit = 5;
const complexityLimit = 1200;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  validationRules: [
    // NoIntrospection, // When Production
    depthLimitRule(depthLimit), // Limited GraphQL Query Depth
    createComplexityLimitRule(complexityLimit, { // Limited GraphQL Query Complexity
      onCost: cost => console.log(colors.bgWhite(colors.black(`[Apollo] Query Costs: ${cost}`))),
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
  context: ({ req, }) => {
    return { db, };
  },
});

server.applyMiddleware({ app, cors: false, });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(455);
httpServer.timeout = 5000; // Set Timeout under 5000ms
