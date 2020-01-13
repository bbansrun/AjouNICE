module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD', {
    board_idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    category_idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100, true),
      allowNull: true,
      defaultValue: null,
    },
    body: {
      type: DataTypes.STRING(20000, true),
      allowNull: true,
      defaultValue: null,
    },
    view_cnt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    cmt_cnt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    reg_ip: {
      type: DataTypes.STRING(40, true),
      allowNull: true,
      defaultValue: null,
    },
    reg_dt: {
      type: DataTypes.DATE,
      allowNull: true,            // 왜 allowNull??
      defaultValue: DataTypes.NOW
    },
    upt_ip: {
      type: DataTypes.STRING(40, true),
      allowNull: true,
      defaultValue: null,
    },
    upt_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DateTypes.NOW,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  })
}