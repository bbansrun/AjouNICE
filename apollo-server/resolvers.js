const { User, College, Department, Board, BoardCategory, sequelize, } = require('./models');
const { Op, } = require('sequelize');
const graphqlFields = require('graphql-fields');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendConfirmMail, } = require('./mailer/mailUtils');

sequelize.sync();

// Query Trigger 압축
const selectAttributes = (info) => {
  return Object.keys(graphqlFields(info)).filter((elem) => elem !== '__typename');
};

const getOne = (model, conditions) => async (parent, args, context, info) => {
  const attributes = selectAttributes(info);
  return await model.findOne({ attributes: attributes, where: conditions, });
};

const getAll = (model, conditions) => async (parent, args, context, info) => {
  const attributes = selectAttributes(info);
  return await model.findAll({ attributes: attributes, where: conditions, });
};

module.exports = {
  Query: {
    // Department
    async findDptByCollege(parent, args, context, info) {
      const conditions = { college_cd: args.college_cd, };
      return await getAll(Department, conditions)(parent, args, context, info);
    },
    // College
    async findColleges(parent, args, context, info) {
      const conditions = { exist_yn: args.exist_yn, };
      return await getAll(College, conditions)(parent, args, context, info);
    },
    // User
    async findNickName(parent, args, context, info) {
      const conditions = { nick_nm: args.nick_nm, };
      return await getAll(User, conditions)(parent, args, context, info);
    },
    async findEmail(parent, args, context, info) {
      const conditions = { email: args.email, };
      return await getAll(User, conditions)(parent, args, context, info);
    },
    async findUserID(parent, args, context, info) {
      const conditions = { user_id: args.userId, };
      return await getAll(User, conditions)(parent, args, context, info);
    },
    async findUserByToken(parent, args, context, info) {
      const conditions = { auth_token: args.token, };
      return await getOne(User, conditions)(parent, args, context, info);
    },
    async findUserByIdx(parent, args, context, info) {
      const conditions = { user_idx: args.user_idx, };
      return await getOne(User, conditions)(parent, args, context, info);
    },
    // BoardCategory
    async findBoardCategories(parent, args, context, info) {
      const conditions = { depth: args.depth, };
      if (args.title) conditions.title = args.title;
      if (args.parent) conditions.parent = args.parent;
      return await getAll(BoardCategory, conditions)(parent, args, context, info);
    },
    // Board
    async findBoardsByBigCategory(parent, args, context, info) {
      const targetCategories = await BoardCategory.findAll({
        attributes: ['category_idx', ], 
        where: { parent: args.category_idx, },
      });
      const categoryIndice = targetCategories.map((model) => model.category_idx);
      const conditions = { category_idx: { [Op.in]: categoryIndice, }, };
      return await getAll(Board, conditions)(parent, args, context, info);
    },
    async findBoardsBySmallCategory(parent, args, context, info) {
      const conditions = { category_idx: args.category_idx, };
      return await getAll(Board, conditions)(parent, args, context, info);
    },
    async findBoardByBoardIdx(parent, args, context, info) {
      const conditions = { board_idx: args.board_idx, };
      return await getOne(Board, conditions)(parent, args, context, info);
    },
  },
  Mutation: {
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
