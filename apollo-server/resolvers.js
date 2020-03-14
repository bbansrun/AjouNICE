const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { Op, } = require('sequelize');
const { sequelize, } = require('./models');
const { PubSub, ForbiddenError, } = require('apollo-server-express');
const { tokenVerify, } = require('./function/jwt/verifier');
const { PROFILE, EDITOR_ATTACHMENTS, CATE_ICON, POST_ATTACHMENTS, } = require('./function/aws/bucketUploadConfig');
const { handleS3Upload, } = require('./function/aws/s3UploadHandler');
const { sendConfirmMail, sendContactMail, } = require('./function/mailer/mailUtils');
const { findOne, findAll, createOne, destroyOne, updateOne, increaseOne, findById, } = require('./function/db/handler');

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
    async categories (root, args, { db, }, info) {
      const include = [
        { model: db.BoardCategory, as: 'childCategories', }
      ];
      return await findAll(db.BoardCategory, args, info, include);
    },
    // College
    async college (root, args, { db, }, info) {
      return await findOne(db.College, args, info);
    },
    async allColleges (root, args, { db, }, info) {
      const include = [
        { model: db.Link, as: 'link', }
      ];
      return await findAll(db.College, args, info, include);
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
      const include = [
        { model: db.Link, as: 'link', }
      ];
      return await findAll(db.Department, args, info, include);
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
        { model: db.Board, as: 'posts', include: [{ model: db.User, as: 'user', }], }
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
    async reports (root, args, { db, }, info) {
      const include = [
        { model: db.User, as: 'user', },
        { model: db.Board, as: 'post', }
      ];
      return await findAll(db.BoardReport, args, info, include);
    },
    async resReports (root, args, { db, }, info) {
      const include = [
        { model: db.User, as: 'user', },
        { model: db.RestaurantBoard, as: 'resource', }
      ];
      return await findAll(db.RestaurantReport, args, info, include);
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
      const paginateOptions = {
        limit,
        desc: true,
        after: end_cursor,
        include: [
          { model: db.BoardCategory, as: 'category', },
          { model: db.User, as: 'user', },
          { model: db.BoardComment, as: 'comments', include: [{ model: db.User, as: 'commenter', }], }
        ],
      };
      if (parseInt(category_idx) !== 0) {
        paginateOptions.where = { category_idx, };
      }
      console.log(paginateOptions);
      return await db.Board.paginate(paginateOptions);
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
    // Common
    async modPost (root, { mode, options, }, { db, }, info) {
      const include = [
        { model: db.BoardCategory, as: 'category', },
        { model: db.User, as: 'user', },
        { model: db.BoardComment, as: 'comments', include: [{ model: db.User, as: 'commenter', }], }
      ];
      if (mode === 'CREATE') {
        const { category_idx, user_idx, title, body, ip, } = options;
        if (category_idx && user_idx && title && body && ip) {
          const args = {
            category_idx,
            user_idx,
            title,
            body,
            reg_ip: ip,
            upt_ip: ip,
          };
          const created = await createOne(db.Board, args);
          if (created) {
            return {
              result: true,
              data: await findOne(db.Board, { board_idx: created.board_idx, }, info, include),
            };
          }
        }
      } else if (mode === 'EDIT') {
        const { board_idx, title, body, ip, } = options;
        if (board_idx && title && body && ip) {
          const args = {
            title,
            body,
            upt_ip: ip,
          };
          const result = await updateOne(db.Board, args, { board_idx, });
          if (result) {
            return {
              result: true,
              data: await findById(db.Board, board_idx, include),
            };
          }
        }
      } else if (mode === 'DESTROY') {
        const { board_idx, } = options;
        if (board_idx) {
          const data = await findById(db.Board, board_idx, include);
          const result = await destroyOne(db.Board, { board_idx, });
          if (result) {
            return {
              result: true,
              data,
            };
          }
        }
      }
      throw new ForbiddenError('잘못된 요청입니다.');
    },
    async modReply (root, { mode, options, }, { db, }, info) {
      if (mode === 'CREATE') {
        const { board_idx, user_idx, parent_idx, text, ip, } = options;
        if (board_idx && user_idx && text && ip) {
          const args = {
            board_idx,
            user_idx,
            text,
            reg_ip: ip,
            upt_ip: ip,
            parent_idx,
          };
          const include = [
            { model: db.User, as: 'commenter', }
          ];
          const data = await createOne(db.BoardComment, args);
          pubsub.publish(REPLY_WRITTEN, { replyWritten: data, });
          return {
            result: true,
            data: await findById(db.BoardComment, data.cmt_idx, include),
          };
        }
      } else if (mode === 'EDIT') {
        const { cmt_idx, text, ip, } = options;
        if (cmt_idx && text && ip) {
          const args = {
            cmt_idx,
            text,
            upt_ip: ip,
          };
          const include = [
            { model: db.User, as: 'commenter', }
          ];
          const data = await findById(db.BoardComment, cmt_idx, include);
          const result = await updateOne(db.BoardComment, args);
          pubsub.publish(REPLY_MODIFIED, { replyModified: data, });
          if (result) {
            return {
              result: true,
              data,
            };
          }
        }
      } else if (mode === 'DESTROY') {
        const { cmt_idx, } = options;
        if (cmt_idx) {
          const data = await findById(db.BoardComment, cmt_idx);
          const result = await destroyOne(db.BoardComment, { cmt_idx, });
          pubsub.publish(REPLY_REMOVED, { replyRemoved: data, });
          if (result) {
            return {
              result: true,
              data,
            };
          }
        }
      }
      throw new ForbiddenError('잘못된 요청입니다.');
    },
    async modReport (root, args, { db, }, info) {
      const params = { text: args.text, user_idx: args.user_idx, board_idx: args.board_idx, reg_ip: args.ip, upt_ip: args.ip, };
      const created = await createOne(db.BoardReport, params);
      if (created) {
        return await findOne(db.BoardReport, params, info);
      } else {
        return {};
      }
    },
    async modResReport (root, args, { db, }, info) {
      const params = { text: args.text, user_idx: args.user_idx, res_idx: args.res_idx, reg_ip: args.ip, upt_ip: args.ip, };
      const created = await createOne(db.RestaurantReport, params);
      if (created) {
        return await findOne(db.RestaurantReport, params, info);
      } else {
        return {};
      }
    },
    async incrementView (root, args, { db, }, info) {
      const updated = await increaseOne(db.Board, 'view_cnt', 1, { board_idx: args.board_idx, });
      if (updated) {
        return await findOne(db.Board, args, info);
      } else {
        return {};
      }
    },
    // Auth
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
    // Admin
    async modCategory (root, { mode, options, }, { db, }, info) {
      if (mode === 'CREATE') {
        const { category_nm, category_type, title, parent, depth, access_auth, private_yn, category_icon, desc, ip, } = options;
        if (category_nm && category_type && title && Number.isInteger(depth) && access_auth && private_yn && desc && ip) {
          const args = {
            category_nm,
            category_type,
            category_icon,
            title,
            depth,
            parent,
            access_auth,
            private_yn,
            desc,
            reg_ip: ip,
            upt_ip: ip,
          };
          const created = await createOne(db.BoardCategory, args);
          if (created) {
            return {
              result: true,
              data: await findOne(db.BoardCategory, { category_idx: created.category_idx, }, info),
            };
          }
        }
      } else if (mode === 'EDIT') {
        const { category_idx, category_nm, title, depth, access_auth, private_yn, category_icon, desc, ip, } = options;
        if (category_idx && category_nm && title && Number.isInteger(depth) && access_auth && private_yn && desc && ip) {
          const args = {
            category_idx,
            category_nm,
            category_icon,
            title,
            depth,
            access_auth,
            private_yn,
            desc,
            upt_ip: ip,
          };
          const updated = await updateOne(db.BoardCategory, args, { category_idx, });
          if (updated) {
            return {
              result: true,
              data: await findById(db.BoardCategory, category_idx),
            };
          }
        }
      } else if (mode === 'DESTROY') {
        const { category_idx, } = options;
        if (category_idx) {
          const data = await findById(db.BoardCategory, category_idx);
          const removed = await destroyOne(db.BoardCategory, { category_idx, });
          if (removed) {
            return {
              result: true,
              data,
            };
          }
        }
      }
      throw new ForbiddenError('잘못된 요청입니다.');
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
    async modCollege (root, { mode, options, }, { db, }, info) {
      if (mode === 'CREATE') {
        const { college_nm, college_cd, exist_yn, ip, } = options;
        if (college_nm && college_cd && exist_yn && ip) {
          const args = {
            college_nm,
            college_cd,
            exist_yn,
            reg_ip: ip,
            upt_ip: ip,
          };
          const data = await createOne(db.College, args);
          if (data) {
            return {
              result: true,
              data,
            };
          }
        }
      } else if (mode === 'EDIT') {
        const { id, college_nm, college_cd, exist_yn, ip, } = options;
        if (id && college_nm && college_cd && exist_yn && ip) {
          const args = {
            id,
            college_nm,
            college_cd,
            exist_yn,
            upt_ip: ip,
          };
          const updated = await updateOne(db.College, args, { id, });
          if (updated) {
            return {
              result: true,
              data: await findById(db.College, id),
            };
          }
        }
      } else if (mode === 'DESTROY') {
        const { id, } = options;
        if (id) {
          const data = await findById(db.College, id);
          const removed = await destroyOne(db.College, { id, });
          if (removed) {
            return {
              result: true,
              data,
            };
          }
        }
      }
      throw new ForbiddenError('잘못된 요청입니다.');
    },
    async modDepartment (root, { mode, options, }, { db, }, info) {
      if (mode === 'CREATE') {
        const { college_cd, dpt_nm, dpt_cd, exist_yn, ip, } = options;
        if (college_cd && dpt_nm && dpt_cd && exist_yn && ip) {
          const args = {
            college_cd,
            dpt_nm,
            dpt_cd,
            exist_yn,
            reg_ip: ip,
            upt_ip: ip,
          };
          const data = await createOne(db.Department, args);
          if (data) {
            return {
              result: true,
              data,
            };
          }
        }
      } else if (mode === 'EDIT') {
        const { id, college_cd, dpt_nm, dpt_cd, exist_yn, ip, } = options;
        if (id && college_cd && dpt_nm && dpt_cd && exist_yn && ip) {
          const args = {
            id,
            college_cd,
            dpt_nm,
            dpt_cd,
            exist_yn,
            upt_ip: ip,
          };
          const updated = await updateOne(db.Department, args, { id, });
          if (updated) {
            return {
              result: true,
              data: await findById(db.Department, id),
            };
          }
        }
      } else if (mode === 'DESTROY') {
        const { id, } = options;
        if (id) {
          const data = await findById(db.Department, id);
          const removed = await destroyOne(db.Department, { id, });
          if (removed) {
            return {
              result: true,
              data,
            };
          }
        }
      }
      throw new ForbiddenError('잘못된 요청입니다.');
    },
    // File Uploads
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
  },
  Posts: connection,
  Gourmets: connection,
  PostEdge: edge,
  GourmetEdge: edge,
};
