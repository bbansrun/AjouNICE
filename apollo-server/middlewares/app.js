const express = require('express');
const app = express();
const cors = require('cors');
const { graphqlDecode, cryptoModule } = require('./securityModule');
app.use(cors());
app.all('*', graphqlDecode, cryptoModule);


module.exports = app;