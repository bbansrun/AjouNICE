module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RESTAURANT_RATE', {
    rate_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    res_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
    },
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
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
      afterUpdate: (restaurantRate, options) => {
        restaurantRate.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
