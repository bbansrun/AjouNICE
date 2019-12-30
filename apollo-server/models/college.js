module.exports = (sequelize, DataTypes) => {
    return sequelize.define('COLLEGE', {
        college_cd: {
            type: DataTypes.STRING(4),
            allowNull: false,
            unique: true
        },
        college_nm: {
            type: DataTypes.STRING(6),
            allowNull: false,
            unique: true
        },
        exist_yn: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        reg_ip: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        reg_dt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        upt_ip: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        upt_dt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    })
}