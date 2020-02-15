module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD_COMMENT', {
    cmt_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    board_idx: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: null,
    },
    user_idx: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: null,
    },
    text: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: null,
    },
    reg_ip: {
      type: DataTypes.STRING(40, true),
      allowNull: true,
      defaultValue: null,
    },
    reg_dt: {
      type: DataTypes.DATE,
      allowNull: true, // 왜 allowNull??
      defaultValue: DataTypes.NOW,
    },
    upt_ip: {
      type: DataTypes.STRING(40, true),
      allowNull: true,
      defaultValue: null,
    },
    upt_dt: {
      type: DataTypes.DATE,
      allowNull: true,
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
