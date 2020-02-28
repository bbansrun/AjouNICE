module.exports = (sequelize, DataTypes) => {
  return sequelize.define('COLLEGE', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    college_cd: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true,
    },
    college_nm: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    exist_yn: {
      type: DataTypes.STRING(1),
      allowNull: false,
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
      afterUpdate: (college, options) => {
        college.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
