module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD_CATEGORY', {
    category_idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    category_nm: {
      type: DataTypes.STRING(50, true),
      allowNull: true,
      defaultValue: null,
    },
    category_type: {
      type: DataTypes.STRING(10, true),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    category_icon: {
      type: DataTypes.STRING(500, true),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(50, true),
      allowNull: true,
      defaultValue: 'title',
    },
    parent: {
      type: DataTypes.TINYINT(20).UNSIGNED.ZEROFILL, // length가 20에 zerofill 거는데 왜??
      allowNull: true,
      defaultValue: null,
    },
    depth: {
      type: DataTypes.TINYINT(3).UNSIGNED,
      allowNull: false,
    },
    access_auth: {
      type: DataTypes.STRING(50, true),
      allowNull: true,
      defaultValue: null,
    },
    private_yn: {
      type: DataTypes.STRING(1, true),
      allowNull: false,
      defaultValue: 'Y',
    },
    desc: {
      type: DataTypes.STRING(50, true),
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
