const path = require('path');
const Sequelize = require('sequelize');
const withPagination = require('sequelize-cursor-pagination');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Schema Definitions
db.User = require('./user')(sequelize, Sequelize);
db.College = require('./college')(sequelize, Sequelize);
db.Department = require('./department')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.BoardCategory = require('./board_category')(sequelize, Sequelize);
db.BoardComment = require('./board_comment')(sequelize, Sequelize);
db.BoardVote = require('./board_vote')(sequelize, Sequelize);
db.BoardReport = require('./board_report')(sequelize, Sequelize);
db.RestaurantBoard = require('./restaurant_board')(sequelize, Sequelize);
db.RestaurantComment = require('./restaurant_comment')(sequelize, Sequelize);
db.RestaurantImg = require('./restaurant_img')(sequelize, Sequelize);
db.RestaurantRate = require('./restaurant_rate')(sequelize, Sequelize);
db.RestaurantReport = require('./restaurant_report')(sequelize, Sequelize);
db.Link = require('./link')(sequelize, Sequelize);

// Relationships
// - From User
// --- User -> Board (1:N)
db.User.hasMany(db.Board, {
  as: 'articles',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.Board.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> RestaurantBoard (1:N)
db.User.hasMany(db.RestaurantBoard, {
  as: 'resPosts',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.RestaurantBoard.belongsTo(db.User, {
  as: 'resPosts',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> BoardComment (1:N)
db.User.hasMany(db.BoardComment, {
  as: 'comments',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.BoardComment.belongsTo(db.User, {
  as: 'commenter',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> RestaurantComment (1:N)
db.User.hasMany(db.RestaurantComment, {
  as: 'gmComments',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.RestaurantComment.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> BoardVote (1:N)
db.User.hasMany(db.BoardVote, {
  as: 'voteTo',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.BoardVote.belongsTo(db.User, {
  as: 'voter',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> BoardReport (1:N)
db.User.hasMany(db.BoardReport, {
  as: 'reports',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.BoardReport.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// --- User -> RestaurantReport (1:N)
db.User.hasMany(db.RestaurantReport, {
  as: 'resReports',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

db.RestaurantReport.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

// - From Board
// --- Board -> BoardComment (1:N)
db.Board.hasMany(db.BoardComment, {
  as: 'comments',
  foreignKey: 'board_idx',
  sourceKey: 'board_idx',
  onDelete: 'cascade',
  foreignKeyConstraint: false,
  hooks: true,
});

db.BoardComment.belongsTo(db.Board, {
  as: 'commented',
  foreignKey: 'board_idx',
  targetKey: 'board_idx',
});

// --- Board -> BoardVote (1:N)
db.Board.hasMany(db.BoardVote, {
  as: 'votes',
  foreignKey: 'board_idx',
  sourceKey: 'board_idx',
});

db.BoardVote.belongsTo(db.Board, {
  as: 'voted',
  foreignKey: 'board_idx',
  targetKey: 'board_idx',
});

// --- Board -> BoardReport (1:N)
db.Board.hasMany(db.BoardReport, {
  as: 'reports',
  foreignKey: 'board_idx',
  sourceKey: 'board_idx',
});

db.BoardReport.belongsTo(db.Board, {
  as: 'post',
  foreignKey: 'board_idx',
  targetKey: 'board_idx',
});

// - From RestaurantBoard
// --- RestaurantBoard -> RestaurantComment (1:N)
db.RestaurantBoard.hasMany(db.RestaurantComment, {
  as: 'comments',
  foreignKey: 'res_idx',
  sourceKey: 'res_idx',
});

db.RestaurantComment.belongsTo(db.RestaurantBoard, {
  as: 'gmCommented',
  foreignKey: 'res_idx',
  targetKey: 'res_idx',
});

// --- RestaurantBoard -> RestaurantImg (1:N)
db.RestaurantBoard.hasMany(db.RestaurantImg, {
  as: 'resources',
  foreignKey: 'res_idx',
  sourceKey: 'res_idx',
});

db.RestaurantImg.belongsTo(db.RestaurantBoard, {
  as: 'resources',
  foreignKey: 'res_idx',
  targetKey: 'res_idx',
});

// --- RestaurantBoard -> RestaurantReport (1:N)
db.RestaurantBoard.hasMany(db.RestaurantReport, {
  as: 'reports',
  foreignKey: 'res_idx',
  sourceKey: 'res_idx',
});

db.RestaurantReport.belongsTo(db.RestaurantBoard, {
  as: 'resource',
  foreignKey: 'res_idx',
  targetKey: 'res_idx',
});

// - From BoardCategory
// --- BoardCategory -> Board (1:N)
db.BoardCategory.hasMany(db.Board, {
  as: 'posts',
  foreignKey: 'category_idx',
  sourceKey: 'category_idx',
});

db.Board.belongsTo(db.BoardCategory, {
  as: 'category',
  foreignKey: 'category_idx',
  targetKey: 'category_idx',
});

// --- BoardCategory to Self (parent column -> category_idx) (1:N)
db.BoardCategory.hasMany(db.BoardCategory, {
  as: 'childCategories',
  foreignKey: 'parent',
  sourceKey: 'category_idx',
});

db.BoardCategory.belongsTo(db.BoardCategory, {
  as: 'parentCategory',
  foreignKey: 'parent',
  targetKey: 'category_idx',
});

// --- BoardCategory -> RestaurantBoard (1:N)
db.BoardCategory.hasMany(db.RestaurantBoard, {
  as: 'category',
  foreignKey: 'category_idx',
  sourceKey: 'category_idx',
});

db.RestaurantBoard.belongsTo(db.BoardCategory, {
  as: 'category',
  foreignKey: 'category_idx',
  targetKey: 'category_idx',
});

// College <-> Department
db.College.hasMany(db.Department, {
  as: 'departments',
  foreignKey: 'college_cd',
  sourceKey: 'college_cd',
});

db.Department.belongsTo(db.College, {
  as: 'departments',
  foreignKey: 'college_cd',
  targetKey: 'college_cd',
});

// College, Department -> Link (1:1)
db.College.hasOne(db.Link, {
  as: 'link',
  foreignKey: 'col_idx',
});

db.Department.hasOne(db.Link, {
  as: 'link',
  foreignKey: 'dpt_idx',
});

db.Link.belongsTo(db.College, {
  as: 'college',
  foreignKey: 'col_idx',
});

db.Link.belongsTo(db.Department, {
  as: 'department',
  foreignKey: 'dpt_idx',
});

// Paginations
const paginateOptions = (primaryKeyField) => ({
  methodName: 'paginate',
  primaryKeyField,
});

withPagination(paginateOptions('board_idx'))(db.Board);
withPagination(paginateOptions('cmt_idx'))(db.BoardComment);
withPagination(paginateOptions('res_idx'))(db.RestaurantBoard);
withPagination(paginateOptions('cmt_idx'))(db.RestaurantComment);

module.exports = db;
