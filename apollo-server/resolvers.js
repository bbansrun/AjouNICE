const { Op, } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const graphqlFields = require('graphql-fields');
const { PubSub, } = require('apollo-server-express');
const { sendConfirmMail, sendContactMail, } = require('./mailer/mailUtils');
const { sequelize, } = require('./models');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(`${__dirname}/config/aws.json`);
const s3 = new AWS.S3();

sequelize.sync({});

// Subscription Websocket
const pubsub = new PubSub();
const REPLY_WRITTEN = 'REPLY_WRITTEN';
const REPLY_REMOVED = 'REPLY_REMOVED';
const IMAGE_UPLOADED = 'IMAGE_UPLOADED';

// JWT Token Verify
const tokenVerify = (token) => (new Promise((resolve, reject) => {
  jwt.verify(token, '4j0uN1ce1', (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
}));

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

module.exports = {
  Subscription: {
    replyWritten: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([REPLY_WRITTEN]),
    },
    replyRemoved: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([REPLY_REMOVED]),
    },
    imageUploaded: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([IMAGE_UPLOADED]),
    },
  },
  Query: {
    // College
    async colleges (root, args, { db, }, info) {
      const include = [
        { model: db.Department, as: 'departments', }
      ];
      return await findAll(db.College, args, info, include);
    },
    // Department
    async departments (root, args, { db, }, info) {
      return await findAll(db.Department, args, info);
    },
    // User
    async user (root, args, { db, }, info) {
      const include = [
        { model: db.Board, as: 'articles', },
        { model: db.BoardComment, as: 'commenter', }
      ];
      return await findOne(db.User, args, info, include);
    },
    // Board
    async boards (root, args, { db, }, info) {
      const include = [
        { model: db.Board, as: 'posts', }
      ];
      return await findAll(db.BoardCategory, args, info, include);
    },
    async posts (root, args, { db, }, info) {
      const order = [
        ['reg_dt', 'DESC']
      ];
      const include = [
        { model: db.BoardComment, as: 'comments', }
      ];
      return await findAll(db.Board, args, info, include, order);
    },
    async post (root, args, { db, }, info) {
      const order = [
        [{ model: db.BoardComment, as: 'comments', }, 'reg_dt', 'DESC'],
        [{ model: db.BoardComment, as: 'comments', }, 'cmt_idx', 'DESC']
      ];
      const include = [
        { model: db.User, as: 'user', },
        { model: db.BoardComment, as: 'comments', include: [{ model: db.User, as: 'commenter', }], }
      ];
      return await findOne(db.Board, args, info, include, order);
    },
    async postsByKeyword (root, args, { db, }, info) {
      const parsedArgs = {
        [Op.or]: [
          { title: { [Op.like]: `%${args.keyword}%`, }, },
          { body: { [Op.like]: `%${args.keyword}%`, }, }
        ],
      };
      return await findAll(db.Board, parsedArgs, info);
    },
    async comment (root, args, { db, }, info) {
      const include = [
        { model: db.User, as: 'commenter', }
      ];
      return await findOne(db.BoardComment, args, info, include);
    },
    async schedule (root, args, { db, }, info) {
      const response = await fetch('http://localhost:5000/api/schedule');
      const result = await response.json();
      return result.result;
    },
    async notice (root, args, { db, }, info) {
      const response = await fetch(`http://localhost:5000/api/notice/${args.code}`);
      const result = await response.json();
      return result.result;
    },
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
    lastLogin: async (root, { userId, ip, }, { db, }, info) => {
      const updateLastLogin = await db.User.update({ log_ip: ip, log_dt: Date.now(), }, { where: { user_id: userId, }, });
      if (updateLastLogin) return true;
      else return false;
    },
    authorize: async (root, { user_idx, }, { db, }, info) => {
      const updateAuthorized = await db.User.update({ auth_email_yn: 'Y', }, { where: { user_idx: user_idx, }, });
      if (updateAuthorized) return true;
      else return false;
    },
    resetEmailToken: async (root, { email, }, { db, }, info) => {
      const salt = await bcrypt.genSalt(10);
      const rawToken = await bcrypt.hash(`AjouNICE!|authToken|${email}|${Date.now()}`, salt);
      const newToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const user = await db.User.update({ auth_token: newToken, auth_email_yn: 'N', }, { where: { email: email, }, });
      sendConfirmMail(undefined, email, newToken, true);
      if (user) return true;
      else return false;
    },
    // Board
    writePost: async (root, args, { db, }, info) => {
      return await createOne(db.Board, args);
    },
    writeReply: async (root, args, { db, }, info) => {
      const created = await createOne(db.BoardComment, args);
      pubsub.publish(REPLY_WRITTEN, { replyWritten: created.dataValues, });
      return created.dataValues;
    },
    removeReply: async (root, args, { db, }, info) => {
      const removed = await destroyOne(db.BoardComment, args);
      pubsub.publish(REPLY_REMOVED, { replyRemoved: removed, });
      if (removed) {
        return true;
      } else {
        return false;
      }
    },
    editPost: async (root, args, { db, }, info) => {
      const updated = await db.Board.update({ ...args, }, { where: { board_idx: args.board_idx, }, });
      if (updated) {
        return await findOne(db.Board, args, info);
      } else {
        return {};
      }
    },
    removePost: async (root, args, { db, }, info) => {
      const removed = await destroyOne(db.Board, args);
      if (removed) {
        return true;
      } else {
        return false;
      }
    },
    singleUpload: async (root, { file, }, { db, }, info) => {
      // Upload Image to S3
      const { filename, mimetype, encoding, createReadStream, } = await file;
      const returnFile = { filename, mimetype, encoding, };
      const param = {
        Bucket: 'ajounice',
        Key: `board/images/${filename}`,
        ACL: 'public-read',
        Body: createReadStream(),
        ContentType: mimetype,
      };
      s3.upload(param, (err, data) => {
        if (err) {
          console.error(`[AWS] S3 업로드 중 에러 발생: ${err}`);
        }
        console.log(data);
      });
      pubsub.publish(IMAGE_UPLOADED, { imageUploaded: returnFile, });
      return returnFile;
    },
  },
};
