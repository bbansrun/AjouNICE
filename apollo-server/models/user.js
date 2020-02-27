module.exports = (sequelize, DataTypes) => {
  return sequelize.define('USER', {
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(256),
      unique: true,
      validate: {
        isEmail: { args: true, msg: '이메일 형식이 올바르지 않습니다.', },
      },
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    user_nm: {
      type: DataTypes.STRING(50),
    },
    identity_num: {
      type: DataTypes.INTEGER(11).UNSIGNED,
    },
    admin_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defalutValue: 'ORD',
    },
    user_type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'U',
    },
    sex_gb: {
      type: DataTypes.STRING(1),
    },
    user_status: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    policy_yn: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'N',
    },
    college_cd: {
      type: DataTypes.STRING(10),
    },
    dpt_cd: {
      type: DataTypes.STRING(13),
    },
    auth_email_yn: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'N',
    },
    auth_token: {
      type: DataTypes.STRING(64),
    },
    user_profile: {
      type: DataTypes.STRING(256),
    },
    nick_nm: {
      type: DataTypes.STRING(50),
    },
    bamboo_stack: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    links: {
      type: DataTypes.STRING(256),
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
      defaultValue: DataTypes.NOW,
    },
    log_ip: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    log_dt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    hooks: {
      afterUpdate: (user, options) => {
        user.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
};
