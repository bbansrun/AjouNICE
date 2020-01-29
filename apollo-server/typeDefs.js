module.exports = `
scalar Date

enum Role {
    ADMIN
    USER
}

directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

type User {
    user_idx: ID!
    email: String
    user_id: String
    password: String
    user_nm: String
    identity_num: String
    user_type: String
    admin_type: String
    sex_gb: String
    user_status: String
    policy_yn: Boolean
    college_cd: String
    dpt_cd: String
    auth_email_yn: String
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

type Board {
    board_idx: ID!
    category_idx: Int
    user_idx: Int
    nick_nm: String
    title: String
    body: String
    view_cnt: Int
    cmt_cnt: Int
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type BoardCategory {
    category_idx: ID!
    category_nm: String
    title: String
    parent: Int
    depth: Int
    access_auth: String
    private_yn: String
    desc: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type Query {
    findDptByCollege(college_cd: String!): [Department],
    findColleges(exist_yn: String!): [College],
    findNickName(nick_nm: String!): [User],
    findEmail(email: String!): [User],
    findUserID(userId: String!): [User],
    findUserByToken(token: String!): User,
    findUserByIdx(user_idx: ID!): User,
    findBoardCategories(depth: Int!, title: String, parent: Int): [BoardCategory],
    findBoardsByBigCategory(category_idx: ID!): [Board],
    findBoardsBySmallCategory(category_idx: ID!): [Board],
    findBoardByBoardIdx(board_idx: ID!): Board,
    boards(depth: Int!): [BoardCategory]
}

type Mutation {
    sendContactMail(name: String!, email: String!, content: String!): Boolean,
    sendRegisterAuthEmail(user_nm: String!, email: String!, auth_token: String!): Boolean,
    lastLogin(userId: String!, ip: String!): Boolean,
    authorize(user_idx: Int!): Boolean,
    resetEmailToken(email: String!): Boolean,
    writeBoard(category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, reg_ip: String): Board,
}
`;
