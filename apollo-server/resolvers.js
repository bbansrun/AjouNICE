const { sendConfirmMail, sendContactMail, } = require('./mailer/mailUtils');
const { User, College, Department, Board, BoardCategory, sequelize, } = require('./models');
const { Op, } = require('sequelize');
const graphqlFields = require('graphql-fields');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

sequelize.sync({});

const findOne = async (model, args, info, include = []) => {
  return await model.findOne({
    attributes: graphqlFields(info),
    where: { ...args, },
    include: include,
  });
};

const findAll = async (model, args, info, include = []) => {
  return await model.findAll({
    attributes: graphqlFields(info),
    where: { ...args, },
    include: include,
  });
};

module.exports = {
  Query: {
    // College
    async colleges (parent, args, context, info) {
      const include = [
        { model: Department, as: 'departments', }
      ];
      return await findAll(College, args, info, include);
    },
    // Department
    async departments (parent, args, context, info) {
      return await findAll(Department, args, info);
    },
    // User
    async user (parent, args, context, info) {
      const include = [
        { model: Board, as: 'articles', }
      ];
      return await findOne(User, args, info, include);
    },
    // Board
    async boards (parent, args, context, info) {
      const include = [
        { model: Board, as: 'posts', }
      ];
      return await findAll(BoardCategory, args, info, include);
    },
    async posts (parent, args, context, info) {
      return await findAll(Board, args, info);
    },
    async post (parent, args, context, info) {
      return await findOne(Board, args, info);
  },
  Mutation: {
    sendContactMail: async (root, { name, email, content, }) => {
      sendContactMail(name, email, content);
      return true;
    },
    sendRegisterAuthEmail: async (root, { user_nm, email, auth_token, }) => {
      sendConfirmMail(user_nm, email, auth_token, false);
      return true;
    },
    lastLogin: async (root, { userId, ip, }) => {
      const updateLastLogin = await User.update({ log_ip: ip, log_dt: Date.now(), }, { where: { user_id: userId, }, });
      if (updateLastLogin) return true;
      else return false;
    },
    authorize: async (root, { user_idx, }) => {
      const updateAuthorized = await User.update({ auth_email_yn: 'Y', }, { where: { user_idx: user_idx, }, });
      if (updateAuthorized) return true;
      else return false;
    },
    resetEmailToken: async (root, { email, }) => {
      const salt = bcrypt.genSaltSync(10);
      const newToken = crypto.createHash('sha256').update(bcrypt.hashSync(email + Date.now(), salt)).digest('hex');
      const user = await User.update({ auth_token: newToken, auth_email_yn: 'N', }, { where: { email: email, }, });
      sendConfirmMail(undefined, email, newToken, true);
      if (user) return true;
      else return false;
    },
    // BOARD
    writeBoard: async (root, { category_idx, user_idx, nick_nm, title, body, reg_ip, }) => {
      const board = await Board.create({
        category_idx,
        user_idx,
        nick_nm: nick_nm,
        title,
        body,
        reg_ip,
      });
      return board;
    },
  },
};
