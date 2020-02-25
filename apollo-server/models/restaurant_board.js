module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RESTAURANT_BOARD', {
    res_idx: {
      type: DataTypes.INTEGER(20).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    },
    res_icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    star_avg: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    res_menu: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    res_info: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    res_lat: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true,
    },
    res_lon: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true,
    },
    res_addr: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    res_phone: {
      type: DataTypes.STRING(50),
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
