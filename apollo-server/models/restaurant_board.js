module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RESTAURANT_BOARD', {
    res_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    category_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    res_nm: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    res_icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    star_avg: {
      type: DataTypes.INTEGER(20),
    },
    view_cnt: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    res_menu: {
      type: DataTypes.STRING(10000),
    },
    res_info: {
      type: DataTypes.STRING(10000),
    },
    res_lat: {
      type: DataTypes.DECIMAL(16, 14),
    },
    res_lon: {
      type: DataTypes.DECIMAL(17, 14),
    },
    res_addr: {
      type: DataTypes.STRING(500),
    },
    res_phone: {
      type: DataTypes.STRING(50),
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
      afterUpdate: (restaurantBoard, options) => {
        restaurantBoard.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
