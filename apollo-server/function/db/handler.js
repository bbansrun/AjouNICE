// DB Query Handler
const graphqlFields = require('graphql-fields');

const findOne = async (model, args, info, include = [], order = []) => {
  return await model.findOne({
    attributes: graphqlFields(info),
    where: { ...args, },
    include,
    order,
  });
};

const findAll = async (model, args, info, include = [], order = []) => {
  return await model.findAll({
    attributes: graphqlFields(info),
    where: { ...args, },
    include,
    order,
  });
};

const createOne = async (model, args) => {
  return await model.create({ ...args, });
};

const destroyOne = async (model, args) => {
  return await model.destroy({ where: { ...args, }, });
};

const updateOne = async (model, value, condArgs) => {
  return await model.update(value, { where: { ...condArgs, }, });
};

const increaseOne = async (model, field, size, conditions) => {
  return await model.increment(field, { by: size, where: { ...conditions, }, });
};

const findById = async (model, id, include = []) => {
  return await model.findByPk(id, { include, });
};

module.exports = { findOne, findAll, createOne, destroyOne, updateOne, increaseOne, findById, };
