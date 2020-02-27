module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD_CATEGORY', {
    category_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    category_nm: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    category_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    parent: {
      type: DataTypes.TINYINT(20).UNSIGNED,
    },
    depth: {
      type: DataTypes.TINYINT(3).UNSIGNED,
      allowNull: false,
    },
    access_auth: {
      type: DataTypes.STRING(50),
    },
    private_yn: {
      type: DataTypes.STRING(1),
      defaultValue: 'Y',
      allowNull: false,
    },
    category_icon: {
      type: DataTypes.STRING(500),
    },
    desc: {
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
      afterUpdate: (boardCategory, options) => {
        boardCategory.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
