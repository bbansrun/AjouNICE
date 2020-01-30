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

db.User.hasMany(db.Board);

db.BoardCategory.hasMany(db.Board, {
  as: 'posts',
  foreignKey: 'category_idx',
});

db.Board.belongsTo(db.BoardCategory, {
  as: 'posts',
  foreignKey: 'category_idx',
});
db.Board.belongsTo(db.User);

module.exports = db;
