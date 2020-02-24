// JWT Token Verify
const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');

const tokenVerify = (token) => (new Promise((resolve, reject) => {
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
}));

module.exports = { tokenVerify, };
