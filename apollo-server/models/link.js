module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LINK', {
    link_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    col_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
    },
    dpt_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
    },
    link_url: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    crawl_type: {
      type: DataTypes.STRING(16),
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
      afterUpdate: (link, options) => {
        link.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
