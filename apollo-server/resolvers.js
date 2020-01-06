const { User, College, Department, sequelize } = require('./models')
const graphqlFields = require('graphql-fields')
const bcrypt = require('bcrypt')

sequelize.sync()

module.exports = {
    Query: {
        async findDptByCollege(parent, args, context, info) {
            return await Department.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    college_cd: args.college_cd
                }
            })
        },
        async findColleges(parent, args, context, info) {
            return await College.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    exist_yn: args.exist_yn
                }
            })
        },
        async findNickName(parent, args, context, info) {
            return await User.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    nick_nm: args.nick_nm
                }
            })
        },
        async findEmail(parent, args, context, info) {
            return await User.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    email: args.email
                }
            })
        },
        async findUserID(parent, args, context, info) {
            return await User.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    user_id: args.userId
                }
            })
        }
    },
    Mutation: {
        register: async (root, { email, user_id, password, user_nm, identity_num, user_type, sex_gb, college_cd, dpt_cd, nick_nm, reg_ip }) => {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password, salt)
            const user = await User.create({
                email,
                user_id,
                password: hashedPassword,
                user_nm,
                identity_num,
                user_type,
                sex_gb,
                user_status: 'Y',
                policy_yn: 'Y',
                college_cd,
                dpt_cd,
                auth_email_yn: 'N',
                auth_token: '',
                user_profile: '',
                nick_nm,
                links: '',
                reg_ip,
                upt_ip: '',
                upt_dt: '',
                log_ip: '',
                log_dt: ''
            })
            return user
        }
    }
}