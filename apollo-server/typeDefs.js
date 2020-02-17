module.exports = `
scalar Email
scalar Date

enum Role {
    ADMIN
    USER
}

directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

type User {
    user_idx: ID!
    email: Email!
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
    articles: [Board!]!
    comments: [BoardComment!]!
    restaurants: [RestaurantBoard!]!
}

type College {
    id: ID!
    college_cd: String
    college_nm: String
    exist_yn: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    departments: [Department!]
}

type Department {
    id: ID!
    dpt_cd: String
    dpt_nm: String
    college: College!
    college_cd: String!
    exist_yn: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type Board {
    board_idx: ID!
    category: BoardCategory!
    category_idx: Int!
    user: User!
    user_idx: Int!
    title: String
    body: String
    view_cnt: Int
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    comments: [BoardComment!]!
}

type BoardCategory {
    category_idx: ID!
    category_nm: String
    category_type: String
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
    posts: [Board!]!
}

type BoardComment {
    cmt_idx: ID!
    board_idx: Int!
    to: Board!
    by: User!
    user_idx: Int!
    text: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    commenter: User!
}

type BoardVote {
    vote_idx: ID!
    board_idx: Int!
    to: Board!
    by: User!
    user_idx: Int!
}

type RestaurantBoard {
    res_idx: ID!
    user: User!
    user_idx: Int!
    res_nm: String
    res_icon: String
    res_category: String
    star_avg: Int
    res_menu: String
    res_info: String
    res_lat: Int
    res_lon: Int
    res_addr: String
    res_phone: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type Notice {
    unit: String!
    code: String!
    boardName: String!
    title: String!
    link: String!
}

type Schedule {
    date: String!
    event: String!
    etc: String!
}

type Subscription {
    replyWritten: BoardComment
    replyRemoved: Boolean
}

type Query {
    users: [User]
    user(user_idx: Int, nick_nm: String, email: String, token: String): User
    colleges(exist_yn: String!): [College]
    departments(college_cd: String): [Department]
    department(dpt_cd: String!): Department
    boards(depth: Int, title: String, parent: Int, category_type: String): [BoardCategory]
    post(board_idx: ID!): Board
    postsByKeyword(keyword: String!): [Board]
    posts(category_idx: ID): [Board]
    comment(cmt_idx: ID!): BoardComment
    schedule: [Schedule]
    notice(code: String!): [Notice]
    doesIDExists(user_id: String!): Boolean
    doesEmailExists(email: String!): Boolean
    doesNickExists(nick_nm: String!): Boolean
    checkTokenValid(auth_token: String!): User
}

type Mutation {
    sendContactMail(name: String!, email: String!, content: String!): Boolean
    sendRegisterAuthEmail(user_nm: String!, email: String!, auth_token: String!): Boolean
    lastLogin(userId: String!, ip: String!): Boolean
    authorize(user_idx: Int!): Boolean
    resetEmailToken(email: String!): Boolean
    writePost(category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, reg_ip: String): Board
    removePost(board_idx: Int!): Boolean
    editPost(board_idx: Int!, category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, upt_ip: String, upt_dt: Date): Board
    writeReply(board_idx: Int!, user_idx: Int!, nick_nm: String!, text: String, reg_ip: String!): BoardComment
    removeReply(cmt_idx: Int!): Boolean
    singleUpload(file: Upload!): String
    postViewed(board_idx: Int!): Board
}
`;
