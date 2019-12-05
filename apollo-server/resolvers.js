const Sequelize = require('sequelize')
const { filter, find } = require('lodash')

const sequelize = new Sequelize('ajounice_dev', 'ajounice_helper', 'bbansrun!', {
    host: 'ajounice-dev-db-rds.ccj2f84oidqh.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql'
})

module.exports = {
    Query: {
        findIdNums(parent, args, context, info) {
            return find({ id: 1, test: 'bbansrun!', identity_num: 201621061 }, { identity_num: args.identityNum })
        },
        findEmail(parent, args, context, info) {
            return find({ id: 1, test: 'bbansrun!', identity_num: 201621061 }, { email: args.email })
        },
        findUserID(parent, args, context, info) {
            return find({ id: 1, test: 'bbansrun!', identity_num: 201621061 }, { user_id: args.user_id })
        }
    }
}