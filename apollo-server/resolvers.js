const { User, sequelize } = require('./models')
const graphqlFields = require('graphql-fields')

sequelize.sync()

module.exports = {
    Query: {
        async findIdNums(parent, args, context, info) {
            return (await User.findAll({
                attributes: Object.keys(graphqlFields(info)).filter((elem) => (elem !== '__typename')),
                where: {
                    identity_num: args.identityNum
                }
            }))[0]
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
    }
}