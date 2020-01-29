const express = require('express');
const app = express();
const cors = require('cors');
const { graphqlDecode } = require('./securityModule');
app.use(cors());
app.all('*', graphqlDecode);


module.exports = app;