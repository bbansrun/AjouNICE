const { User, sequelize } = require('./models')
const graphqlFields = require('graphql-fields')
const bcrypt = require('bcrypt')

sequelize.sync()

module.exports = {
    Query: {
        async findIdNums(parent, args, context, info) {
            return await User.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    identity_num: args.identityNum
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
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                email,
                user_id,
                password: hashedPassword,
                user_nm,
                identity_num,
                user_type,
                sex_gb,
                user_status: 'N',
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