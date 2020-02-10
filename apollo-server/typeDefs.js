module.exports = `
scalar Date

input ImageInput {
    name: String!
    description: String
    file: Upload!
}

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
    nick_nm: String
    title: String
    body: String
    view_cnt: Int
    cmt_cnt: Int
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    comments: [BoardComment!]!
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
    posts: [Board!]!
}

type BoardComment {
    cmt_idx: ID!
    board_idx: Board!
    user: User!
    user_idx: Int!
    nick_nm: String
    text: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    commenter: User!
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
    user(user_idx: Int, nick_nm: String, email: String, token: String): User
    colleges(exist_yn: String!): [College]
    departments(college_cd: String): [Department]
    boards(depth: Int, title: String, parent: Int): [BoardCategory]
    post(board_idx: ID!): Board
    posts(category_idx: ID): [Board] 
    comment(cmt_idx: ID!): BoardComment
    schedule: [Schedule]
    notice(code: String!): [Notice]
}

type Mutation {
    sendContactMail(name: String!, email: String!, content: String!): Boolean
    sendRegisterAuthEmail(user_nm: String!, email: String!, auth_token: String!): Boolean
    lastLogin(userId: String!, ip: String!): Boolean
    authorize(user_idx: Int!): Boolean
    resetEmailToken(email: String!): Boolean
    writePost(category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, reg_ip: String): Board
    writeReply(board_idx: Int!, user_idx: Int!, nick_nm: String!, text: String): BoardComment
    removeReply(cmt_idx: Int!): Boolean
    editPost(board_idx: Int!, category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, reg_ip: String): Board
    removePost(board_idx: Int!): Boolean
}
`;
