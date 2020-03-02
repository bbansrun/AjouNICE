const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { Op, } = require('sequelize');
const { sequelize, } = require('./models');
const { PubSub, } = require('apollo-server-express');
const { tokenVerify, } = require('./function/jwt/verifier');
const { PROFILE, EDITOR_ATTACHMENTS, CATE_ICON, POST_ATTACHMENTS, } = require('./function/aws/bucketUploadConfig');
const { handleS3Upload, } = require('./function/aws/s3UploadHandler');
const { sendConfirmMail, sendContactMail, } = require('./function/mailer/mailUtils');
const { findOne, findAll, createOne, destroyOne, updateOne, increaseOne, } = require('./function/db/handler');

sequelize.sync({});

// S3 Upload Config
const s3Config = (uploadType, options) => {
  let config;
  if (uploadType === 'EDITOR_ATTACHMENTS') {
    config = EDITOR_ATTACHMENTS(options[uploadType].category);
  } else if (uploadType === 'POST_ATTACHMENTS') {
    config = POST_ATTACHMENTS(options[uploadType].res_idx);
  } else if (uploadType === 'PROFILE') {
    config = PROFILE(options[uploadType].user_idx);
  } else {
    config = CATE_ICON();
  }
  return config;
};

// Subscription Websocket
const pubsub = new PubSub();
const REPLY_WRITTEN = 'REPLY_WRITTEN';
const REPLY_REMOVED = 'REPLY_REMOVED';
const REPLY_MODIFIED = 'REPLY_MODIFIED';
const GOURMET_RATED = 'GOURMET_RATED';
const GOURMET_REPLY_WRITTEN = 'GOURMET_REPLY_WRITTEN';
const GOURMET_REPLY_REMOVED = 'GOURMET_REPLY_REMOVED';
const GOURMET_REPLY_MODIFIED = 'GOURMET_REPLY_MODIFIED';

const connection = {
  pageInfo: (parent) => (parent.cursors),
  edges: (parent) => (parent.results),
};

const edge = {
  node: (parent) => (parent),
  cursor: (parent) => (Buffer.from(`[${parent.board_idx}]`).toString('base64')),
};

module.exports = {
  Subscription: {
    replyWritten: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([REPLY_WRITTEN]),
    },
    replyRemoved: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([REPLY_REMOVED]),
    },
    replyModified: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([REPLY_MODIFIED]),
    },
    gourmetRated: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([GOURMET_RATED]),
    },
    gourmetReplyWritten: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([GOURMET_REPLY_WRITTEN]),
    },
    gourmetReplyRemoved: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([GOURMET_REPLY_REMOVED]),
    },
    gourmetReplyModified: {
      subscribe: (root, args, { db, }, info) => pubsub.asyncIterator([GOURMET_REPLY_MODIFIED]),
    },
  },
  Query: {
    // Common
    async me (root, { token, }, { db, }, info) {
      const verified = (await tokenVerify(token)).user;
      const include = [
        { model: db.Board, as: 'articles', },
        { model: db.BoardComment, as: 'comments', }
      ];
      if (verified) return await findOne(db.User, { user_idx: verified.idx, }, info, include);
    },
    // College
    async college (root, args, { db, }, info) {
      return await findOne(db.College, args, info);
    },
    async allColleges (root, args, { db, }, info) {
      return await findAll(db.College, args, info);
    },
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
        { model: db.BoardComment, as: 'comments', }
      ];
      return await findOne(db.User, args, info, include);
    },
    // 관리자 단독!! 향후 권한 처리
    async users (root, args, { db, }, info) {
      const include = [
        { model: db.Board, as: 'articles', },
        { model: db.BoardComment, as: 'comments', }
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
        { model: db.BoardComment, as: 'comments', },
        { model: db.User, as: 'user', }
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
      // RESTful API Wrapper (from Auth Server)
      const response = await fetch(`http://${require('ip').address()}:5000/api/schedule`);
      const result = await response.json();
      return result.result;
    },
    async notice (root, args, { db, }, info) {
      // RESTful API Wrapper (from Auth Server)
      const response = await fetch(`http://${require('ip').address()}:5000/api/notice/${args.code}`);
      const result = await response.json();
      return result.result;
    },
    // Auth
    async doesIDExists (root, args, { db, }, info) {
      const response = await findOne(db.User, args, info);
      if (response) return true;
      else return false;
    },
    async doesEmailExists (root, args, { db, }, info) {
      const response = await findOne(db.User, args, info);
      if (response) return true;
      else return false;
    },
    async doesNickExists (root, args, { db, }, info) {
      const response = await findOne(db.User, args, info);
      if (response) return true;
      else return false;
    },
    async checkTokenValid (root, args, { db, }, info) {
      return await findOne(db.User, args, info);
    },
    async gourmets (root, args, { db, }, info) {
      return await findAll(db.RestaurantBoard, args, info);
    },
    async gourmetsByCate (root, args, { db, }, info) {
      const include = [
        { model: db.BoardCategory, as: 'category', }
      ];
      return await findAll(db.RestaurantBoard, args, info, include);
    },
    // Renew Resolve Functions Below
    async boardById (root, args, { db, }, info) {
      return await findOne(db.BoardCategory, args, info);
    },
    async boardByType (root, args, { db, }, info) {
      return await findOne(db.BoardCategory, args, info);
    },
    // Common
    async CateById (root, args, { db, }, info) {
      return await findOne(db.BoardCategory, args, info);
    },
    // Gourmet
    async gourmetById (root, args, { db, }, info) {
      const include = [
        { model: db.BoardCategory, as: 'category', },
        { model: db.RestaurantComment, as: 'comments', include: [{ model: db.User, as: 'user', }], },
        { model: db.RestaurantImg, as: 'resources', }
      ];
      return await findOne(db.RestaurantBoard, args, info, include);
    },
    // Pagination
    async paginatedPosts (root, { category_idx, limit, end_cursor, }, { db, }, info) {
      return await db.Board.paginate({
        limit,
        desc: true,
        where: { category_idx, },
        after: end_cursor,
        include: [
          { model: db.BoardCategory, as: 'category', },
          { model: db.User, as: 'user', },
          { model: db.BoardComment, as: 'comments', include: [{ model: db.User, as: 'commenter', }], }
        ],
      });
    },
    async paginatedGourmets (root, { category_idx, limit, end_cursor, }, { db, }, info) {
      return await db.RestaurantBoard.paginate({
        limit,
        desc: true,
        where: { category_idx, },
        after: end_cursor,
      });
    },
  },
  Mutation: {
    async imageUpload (root, { uploadType, file, options, }, { db, }, info) {
      // 단일 S3 업로드
      const { key, filename, } = s3Config(uploadType, options);
      const { Location, } = await handleS3Upload(file, key, filename);
      return Location;
    },
    async batchImageUpload (root, { uploadType, files, options, }, { db, }, info) {
      // 배치식 S3 업로드
      const locations = [];
      await Promise.all(files.map(async (file) => {
        const { key, filename, } = s3Config(uploadType, options);
        const { Location, } = await handleS3Upload(file, key, filename);
        locations.push(Location);
      }));
      return locations;
    },
    sendContactMail: async (root, { name, email, content, }) => {
      sendContactMail(name, email, content);
      return true;
    },
    sendRegisterAuthEmail: async (root, { user_nm, email, auth_token, }) => {
      sendConfirmMail(user_nm, email, auth_token, false);
      return true;
    },
    lastLogin: async (root, { user_id, ip, }, { db, }, info) => {
      const updateLastLogin = await updateOne(db.User, { log_ip: ip, log_dt: Date.now(), }, { user_id, });
      if (updateLastLogin) return await findOne(db.User, { user_id, }, info);
      else return {};
    },
    authorize: async (root, args, { db, }, info) => {
      const updateAuthorized = await updateOne(db.User, { auth_email_yn: 'Y', }, args);
      if (updateAuthorized) return true;
      else return false;
    },
    resetEmailToken: async (root, { email, }, { db, }, info) => {
      const salt = await bcrypt.genSalt(10);
      const rawToken = await bcrypt.hash(`AjouNICE!|authToken|${email}|${Date.now()}`, salt);
      const newToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const user = await updateOne(db.User, { auth_token: newToken, auth_email_yn: 'N', }, { email, });
      sendConfirmMail(undefined, email, newToken, true);
      if (user) return true;
      else return false;
    },
    // Board
    writePost: async (root, args, { db, }, info) => {
      return await createOne(db.Board, args);
    },
    writeReply: async (root, args, { db, }, info) => {
      let result;
      const created = await createOne(db.BoardComment, args);
      if (created) {
        const include = [
          { model: db.User, as: 'commenter', }
        ];
        result = await findOne(db.BoardComment, args, info, include);
        pubsub.publish(REPLY_WRITTEN, { replyWritten: result, });
      }
      return result;
    },
    removeReply: async (root, args, { db, }, info) => {
      const target = await findOne(db.BoardComment, args, info);
      const removed = await destroyOne(db.BoardComment, args);
      pubsub.publish(REPLY_REMOVED, { replyRemoved: target, });
      if (removed) {
        return target;
      } else {
        return false;
      }
    },
    editReply: async (root, args, { db, }, info) => {
      const updated = await updateOne(db.BoardComment, { text: args.text, }, { cmt_idx: args.cmt_idx, });
      if (updated) {
        const include = [
          { model: db.User, as: 'commenter', }
        ];
        const result = await findOne(db.BoardComment, args, info, include);
        pubsub.publish(REPLY_MODIFIED, { replyModified: result, });
        return result;
      } else {
        return {};
      }
    },
    editPost: async (root, args, { db, }, info) => {
      const updated = await updateOne(db.Board, { ...args, }, { board_idx: args.board_idx, });
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
    addCategory: async (root, args, { db, }, info) => {
      const created = await createOne(db.BoardCategory, args);
      if (created) {
        return await findOne(db.BoardCategory, args, info);
      } else {
        return {};
      }
    },
    postViewed: async (root, args, { db, }, info) => {
      const updated = await increaseOne(db.Board, 'view_cnt', 1, { board_idx: args.board_idx, });
      if (updated) {
        return await findOne(db.Board, args, info);
      } else {
        return {};
      }
    },
    removeCategory: async (root, args, { db, }, info) => {
      const removed = await destroyOne(db.BoardCategory, args);
      if (removed) return true;
      else return false;
    },
    removeGourmet: async (root, args, { db, }, info) => {
      const removed = await destroyOne(db.RestaurantBoard, args);
      if (removed) return true;
      else return false;
    },
    addGourmetPlace: async (root, args, { db, }, info) => {
      const created = await createOne(db.RestaurantBoard, args);
      if (created) {
        return await findOne(db.RestaurantBoard, args, info);
      } else {
        return {};
      }
    },
    modCollege: async (root, { id, college_cd, college_nm, }, { db, }, info) => {
      const variables = {};
      if (college_cd) {
        variables.college_cd = college_cd;
      }
      if (college_nm) {
        variables.college_nm = college_nm;
      }
      const updated = await updateOne(db.College, variables, { id, });
      if (updated) {
        return await findOne(db.College, { id, college_cd, college_nm, }, info);
      } else {
        return {};
      }
    },
    modDepartment: async (root, { id, dpt_cd, dpt_nm, }, { db, }, info) => {
      const variables = {};
      if (dpt_cd) {
        variables.dpt_cd = dpt_cd;
      }
      if (dpt_nm) {
        variables.dpt_nm = dpt_nm;
      }
      const updated = await updateOne(db.Department, variables, { id, });
      if (updated) {
        return await findOne(db.Department, { id, dpt_cd, dpt_nm, }, info);
      } else {
        return {};
      }
    },
    createCollege: async (root, args, { db, }, info) => {
      const created = await createOne(db.College, args);
      if (created) {
        return await findOne(db.College, args, info);
      } else {
        return {};
      }
    },
    createDepartment: async (root, args, { db, }, info) => {
      const created = await createOne(db.Department, args);
      if (created) {
        return await findOne(db.Department, args, info);
      } else {
        return {};
      }
    },
  },
  Posts: connection,
  Gourmets: connection,
  PostEdge: edge,
  GourmetEdge: edge,
};
