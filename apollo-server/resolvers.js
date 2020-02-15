const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { Op, } = require('sequelize');
const { sequelize, } = require('./models');
const fileExtension = require('file-extension');
const graphqlFields = require('graphql-fields');
const { PubSub, } = require('apollo-server-express');
const { sendConfirmMail, sendContactMail, } = require('./mailer/mailUtils');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(`${__dirname}/config/aws.json`);
const s3 = new AWS.S3();

sequelize.sync({});

// Subscription Websocket
const pubsub = new PubSub();
const REPLY_WRITTEN = 'REPLY_WRITTEN';
const REPLY_REMOVED = 'REPLY_REMOVED';
const IMAGE_UPLOADED = 'IMAGE_UPLOADED';

// AWS File Upload Handler
const s3DefaultParams = {
  ACL: 'public-read',
  Bucket: 'ajounice',
  Conditions: [
    ['content-length-range', 0, 1024 ** 2 * 20], // Max: 20MB per each
    { acl: 'public-read', }
  ],
};

const handleS3Upload = async (file) => {
  const { createReadStream, filename, mimetype, } = await file;
  const key = uuid();
  return new Promise((resolve, reject) => {
    s3.upload({
      ...s3DefaultParams,
      Body: createReadStream(),
      Key: `board/name/${key}.${fileExtension(filename)}`,
      ContentType: mimetype,
    }, (err, data) => {
      if (err) {
        console.error(`[AWS] ${err}`);
        console.log(err);
        reject(err);
      } else {
        console.log('[AWS] 성공적으로 데이터 업로드 완료');
        console.log(data);
        resolve(data);
      }
    });
  });
};

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
    async department (root, args, { db, }, info) {
      return await findOne(db.Department, args, info);
    },
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
    // 관리자 단독!! 향후 권한 처리
    async users (root, args, { db, }, info) {
      const include = [
        { model: db.Board, as: 'articles', },
        { model: db.BoardComment, as: 'commenter', }
      ];
      return await findAll(db.User, args, info, include);
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
        { model: db.BoardCategory, as: 'category', },
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
      const include = [
        { model: db.User, as: 'user', },
        { model: db.BoardComment, as: 'comments', include: [{ model: db.User, as: 'commenter', }], }
      ];
      return await findAll(db.Board, parsedArgs, info, include);
    },
    async comment (root, args, { db, }, info) {
      const include = [
        { model: db.User, as: 'commenter', }
      ];
      return await findOne(db.BoardComment, args, info, include);
    },
    async schedule (root, args, { db, }, info) {
      const response = await fetch(`http://${require('ip').address()}:5000/api/schedule`);
      const result = await response.json();
      return result.result;
    },
    async notice (root, args, { db, }, info) {
      const response = await fetch(`http://${require('ip').address()}:5000/api/notice/${args.code}`);
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
      // const { Location, } = await handleS3Upload(file);
      // return Location;
    },
  },
};
