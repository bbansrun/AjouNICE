module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RESTAURANT_IMG', {
    img_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    res_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      allowNull: false,
    },
    img_path: {
      type: DataTypes.STRING(500),
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
      afterUpdate: (restaurantImg, options) => {
        restaurantImg.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
