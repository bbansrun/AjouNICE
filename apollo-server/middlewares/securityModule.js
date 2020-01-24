const graphqlDecode = (req, res, next) => {
  console.log('try me bitch');
  next();
};

const cryptoModule = (req, res, next) => {
  console.log('try me bitch');
  next();
};



module.exports = { graphqlDecode, cryptoModule };