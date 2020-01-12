module.exports = (sequelize, DataTypes) => {
    return sequelize.define('USER', {
        user_idx: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: true,
            unique: true,
            defaultValue: null,
            validate: {
                isEmail: { args: true, msg: '이메일 형식이 올바르지 않습니다.' }
            }
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        user_nm: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null
        },
        identity_num: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true
        },
        user_type: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'U'
        },
        admin_type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defalutValue: 'ORD'
        },
        sex_gb: {
            type: DataTypes.STRING(1),
            allowNull: true,
            defaultValue: null
        },
        user_status: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        policy_yn: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 0
        },
        college_cd: {
            type: DataTypes.STRING(9),
            allowNull: true
        },
        dpt_cd: {
            type: DataTypes.STRING(12),
            allowNull: true
        },
        auth_email_yn: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        auth_token: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        user_profile: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        nick_nm: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        bamboo_stack: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        links: {
            type: DataTypes.STRING(256),
            allowNull: true
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
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        log_ip: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        log_dt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    })
}