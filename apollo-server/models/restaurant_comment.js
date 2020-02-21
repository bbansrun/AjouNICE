module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RESTAURANT_COMMENT', {
    cmt_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    res_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      defaultValue: null,
    },
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    text: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    star: {
      type: DataTypes.INTEGER(20),
    },
    parent_idx: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
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
    },
  }, {
    hooks: {
      afterUpdate: (restaurantComment, options) => {
        restaurantComment.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
