module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD_COMMENT', {
    cmt_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    board_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(1000),
    },
    reg_ip: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    reg_dt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    upt_ip: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    upt_dt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    hooks: {
      afterUpdate: (boardComment, options) => {
        boardComment.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
