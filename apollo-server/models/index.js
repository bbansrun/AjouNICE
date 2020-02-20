const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.College = require('./college')(sequelize, Sequelize);
db.Department = require('./department')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.BoardCategory = require('./board_category')(sequelize, Sequelize);
db.BoardComment = require('./board_comment.js')(sequelize, Sequelize);
db.BoardVote = require('./board_vote')(sequelize, Sequelize);
db.RestaurantBoard = require('./restaurant_board')(sequelize, Sequelize);

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

db.User.hasMany(db.Board, {
  as: 'articles',
  foreignKey: 'user_idx',
  sourceKey: 'user_idx',
});

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

db.Board.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'user_idx',
  targetKey: 'user_idx',
});

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

module.exports = db;
