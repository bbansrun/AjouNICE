// Directive Resolvers
const { tokenVerify, } = require('./function/jwt/verifier');

module.exports = {
  hasRole: (next, source, { role, }, ctx) => {
    // Check Admin
  },
};
