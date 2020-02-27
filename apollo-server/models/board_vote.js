module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BOARD_VOTE', {
    vote_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    board_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    user_idx: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    vote_type: {
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
      afterUpdate: (boardVote, options) => {
        boardVote.upt_dt = DataTypes.NOW;
      },
    },
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });
}
;
