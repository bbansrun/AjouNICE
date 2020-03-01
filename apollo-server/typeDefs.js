const scalars = `
scalar Email
scalar Date
`;

const enums = `
enum Role {
    ADMIN                   # Service Module Managerable
    USER                    # Just for using service contents
}

enum CategoryType {
    NORMAL
    GOURMET
    REALTY
}

enum S3UploadType {
    CATE_ICON               # Regular Board, Gourmet, Realty, etc,.
    EDITOR_ATTACHMENTS      # Board Attachments Using CKEditor
    POST_ATTACHMENTS        # Board Attachments except Editor Attachments
    PROFILE                 # Profile Images
}
`;

const input = `
input ImgProfileInput {
    raw: Boolean!
    user_idx: Int
}

input ImgEditorInput {
    category: String!
}

input ImgGourmetResInput {
    res_idx: Int!
}

input S3UploadInput {
    PROFILE: ImgProfileInput
    CATE_ICON: Boolean
    POST_ATTACHMENTS: ImgGourmetResInput
    EDITOR_ATTACHMENTS: ImgEditorInput
}
`;

const directives = `
directive @auth(requires: Role = ADMIN) on FIELD_DEFINITION | ENUM_VALUE
`;

const customTypes = `
type User {
    user_idx: ID!
    email: Email!
    user_id: String!
    password: String
    user_nm: String
    identity_num: String
    admin_type: String
    user_type: String
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
    articles: [Board]
    comments: [BoardComment]
    restaurants: [RestaurantBoard]
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
    departments: [Department]
}

type Department {
    id: ID!
    college_cd: String!
    college: College!
    dpt_cd: String
    dpt_nm: String
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
    comments: [BoardComment]
}

type BoardCategory {
    category_idx: ID!
    category_nm: String
    category_type: CategoryType
    title: String
    parent: Int
    depth: Int
    access_auth: String
    private_yn: String
    category_icon: String
    desc: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    posts: [Board]
}

type BoardComment {
    cmt_idx: ID!
    board_idx: Int!
    user_idx: Int!
    from: Board!
    commenter: User
    text: String
    parent_idx: Int
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type BoardVote {
    vote_idx: ID!
    board_idx: Int!
    user_idx: Int!
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    to: Board!
    by: User!
}

type RestaurantBoard {
    res_idx: ID!
    user: User!
    user_idx: Int!
    category: BoardCategory!
    category_idx: Int!
    res_nm: String
    res_icon: String
    star_avg: Int
    view_cnt: Int
    res_menu: String
    res_info: String
    res_lat: Float
    res_lon: Float
    res_addr: String
    res_phone: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
    comments: [RestaurantComment]
    resources: [RestaurantImg]
}

type RestaurantComment {
    cmt_idx: Int!
    res_idx: Int!
    user_idx: Int!
    user: User!
    text: String
    star: Int!
    parent_idx: Int
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type RestaurantImg {
    img_idx: Int!
    res_idx: Int!
    img_path: String!
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type RestaurantRate {
    rate_idx: ID!
    res_idx: Int!
    resource: RestaurantBoard!
    user_idx: Int!
    user: User!
    score: Int
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

# Types for pagination
interface Edge {
    cursor: String
}

interface PaginatedUnit {
    pageInfo: PageInfo!
}

type PageInfo {
    hasNext: Boolean
    hasPrevious: Boolean
    before: String
    after: String
}

type Posts implements PaginatedUnit {
    pageInfo: PageInfo!
    edges: [PostEdge]
}

type Gourmets implements PaginatedUnit {
    pageInfo: PageInfo!
    edges: [GourmetEdge]
}

type PostEdge implements Edge {
    node: Board,
    cursor: String
}

type GourmetEdge implements Edge {
    node: RestaurantBoard,
    cursor: String
}
`;

const subscription = `
type Subscription {
    replyWritten: BoardComment
    replyRemoved: BoardComment
    replyModified: BoardComment
    gourmetRated: RestaurantBoard
    gourmetReplyWritten: RestaurantComment
    gourmetReplyRemoved: RestaurantComment
    gourmetReplyModified: RestaurantComment
}
`;

const query = `
type Query {
    me: User
    users: [User]
    user(user_idx: Int, nick_nm: String, email: String, token: String): User # Will be deprecdated
    allColleges: [College]
    college(college_cd: String!): College
    colleges(exist_yn: String!): [College]
    departments(college_cd: String): [Department]
    department(dpt_cd: String!): Department
    gourmetById(res_idx: ID!): RestaurantBoard
    gourmets: [RestaurantBoard]
    gourmetsByCate(category_idx: Int!): [RestaurantBoard]
    boards(depth: Int, title: String, parent: Int, category_type: CategoryType): [BoardCategory]
    post(board_idx: ID!): Board
    postsByKeyword(keyword: String!): [Board]
    posts(category_idx: ID): [Board]
    boardById(category_idx: ID): BoardCategory
    boardByType(category_type: CategoryType, title: String): BoardCategory
    comment(cmt_idx: ID!): BoardComment
    schedule: [Schedule]
    notice(code: String!): [Notice]
    # Common
    CateById(category_idx: Int!): BoardCategory
    # Auth
    doesIDExists(user_id: String!): Boolean
    doesEmailExists(email: String!): Boolean
    doesNickExists(nick_nm: String!): Boolean
    checkTokenValid(auth_token: String!): User
    # Pagination
    paginatedPosts(category_idx: ID!, limit: Int!, end_cursor: String): Posts
    paginatedGourmets(category_idx: ID!, limit: Int!, end_cursor: String): Gourmets
}
`;

const mutation = `
type Mutation {
    # Auth
    sendContactMail(name: String!, email: String!, content: String!): Boolean
    sendRegisterAuthEmail(user_nm: String!, email: String!, auth_token: String!): Boolean
    lastLogin(user_id: String!, ip: String!): User
    authorize(user_idx: Int!, auth_token: String!): Boolean
    resetEmailToken(email: String!): Boolean
    # Common
    imageUpload(uploadType: S3UploadType!, file: Upload!, options: S3UploadInput!): String
    batchImageUpload(uploadType: S3UploadType!, files: [Upload!]!, options: S3UploadInput!): [String]
    writePost(category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, reg_ip: String!, upt_ip: String!): Board
    removePost(board_idx: Int!): Boolean
    editPost(board_idx: Int!, category_idx: Int!, user_idx: Int!, nick_nm: String, title: String, body: String, upt_ip: String, upt_dt: Date): Board
    postViewed(board_idx: Int!): Board
    writeReply(board_idx: Int!, user_idx: Int!, text: String, reg_ip: String!, upt_ip: String!): BoardComment
    removeReply(cmt_idx: Int!): BoardComment
    editReply(cmt_idx: Int!, text: String): BoardComment
    removeGourmet(res_idx: Int!): Boolean
    # Admin
    addCategory(category_nm: String!, category_type: CategoryType!, title: String!, depth: Int!, access_auth: String!, private_yn: String!, category_icon: String, desc: String, reg_ip: String!, upt_ip: String!): BoardCategory
    removeCategory(category_idx: Int!): Boolean
    addGourmetPlace(res_nm: String!, category_idx: Int!, user_idx: Int!, res_info: String, res_menu: String, res_phone: String, res_addr: String, res_icon: String, reg_ip: String!, upt_ip: String!): RestaurantBoard
    addNewDepartment(dpt_nm: String!, dpt_cd: String!): Department
    addNewCollege(college_nm: String!, college_cd: String!): College
    modCollege(id: Int!, college_nm: String, college_cd: String): College
    modDepartment(id: Int!, dpt_nm: String, dpt_cd: String): Department
    createCollege(college_nm: String!, college_cd: String!, exist_yn: String!, reg_ip: String!, upt_ip: String!): College
    createDepartment(college_cd: String!, dpt_nm: String!, dpt_cd: String!, exist_yn: String!, reg_ip: String!, upt_ip: String!): Department
}
`;

module.exports = `
${scalars}
${enums}
${input}
${directives}
${customTypes}
${subscription}
${query}
${mutation}
`;
