const express = require('express');
const app = express();
const cors = require('cors');

const expressPlayground = require('graphql-playground-middleware-express').default;
const { graphqlDecode, } = require('./securityModule');

app.use(cors());
app.all('*', graphqlDecode);
app.get('/', (req, res) => res.end('AjouNICE! resource API Server'));
app.get('/playground', expressPlayground({ endpoint: '/graphql', }));

module.exports = app;
