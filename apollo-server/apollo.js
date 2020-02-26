const http = require('http');
const app = require('./middlewares/app');
const { encodeTextBody, } = require('./middlewares/securityModule');

const config = require('./config/config.json');

const { LoggerExtension, } = require('apollo-server-logger');
const { RedisCache, } = require('apollo-server-cache-redis');
const {
  ApolloServer,
  gql,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');

const db = require('./models');
const typeDefs = gql(require('./typeDefs'));
const resolvers = require('./resolvers');
const directiveResolvers = require('./directiveResolvers');

const depthLimit = require('graphql-depth-limit');
const NoIntrospection = require('graphql-disable-introspection');
const { createComplexityLimitRule, } = require('graphql-validation-complexity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  directiveResolvers,
  validationRules: [
    // NoIntrospection, // When Production
    depthLimit(5), // Limited GraphQL Query Depth
    createComplexityLimitRule(700, { // Limited GraphQL Query Complexity
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
    let token;
    if (req.headers.Authorization) {
      token = req.headers.Authorization.substr(7);
    }
    return { db, token, };
  },
});

server.applyMiddleware({ app, cors: false, });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(455);
httpServer.timeout = 5000; // Set Timeout under 5000ms
