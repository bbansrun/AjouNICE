module.exports = `type User {
    user_idx: ID!
    email: String
    user_id: String
    password: String
    user_nm: String
    identity_num: String
    user_type: String
    sex_gb: String
    user_status: String
    policy_yn: Boolean
    college_cd: String
    dpt_cd: String
    auth_email_yn: Boolean
    auth_token: String
    user_profile: String
    nick_nm: String
    bamboo_stack: Int
    links: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    log_ip: String
    log_dt: Date
}

type College {
    college_cd: String
    college_nm: String
    exist_yn: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type Department {
    dpt_cd: String
    dpt_nm: String
    college_cd: String
    exist_yn: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

scalar Date

type Query {
    findDptByCollege(college_cd: String!): [Department],
    findColleges(exist_yn: String!): [College],
    findNickName(nick_nm: String!): [User],
    findEmail(email: String!): [User],
    findUserID(userId: String!): [User]
}

type Mutation {
    register(email: String!, user_id: String!, password: String!, user_nm: String!, identity_num: Int, user_type: String!, sex_gb: String!, college_cd: String, dpt_cd: String, nick_nm: String!, reg_ip: String!): User!,
    lastLogin(userId: String!, ip: String!): Boolean 
}
`