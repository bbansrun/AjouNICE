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
    NOTICE
    NORMAL
    GOURMET
    REALTY
}

enum S3UploadType {
    CATE_ICON               # Category Icon for type (Board, Gourmet, Realty, etc,.)
    REST_ST_ICON            # Standard Icon for Restaurant Resource
    EDITOR_ATTACHMENTS      # Board Attachments Using CKEditor
    POST_ATTACHMENTS        # Board Attachments except Editor Attachments
    PROFILE                 # Profile Images
}

enum ManipulationMode {
    CREATE
    EDIT
    DESTROY
}
`;

const input = `
input BoardInput {
    board_idx: Int
    category_idx: Int
    user_idx: Int
    title: String
    body: String
    ip: String
}

input ReplyInput {
    cmt_idx: Int
    board_idx: Int
    user_idx: Int
    parent_idx: Int
    text: String
    ip: Date
}

input CollegeInput {
    id: ID
    college_nm: String
    college_cd: String
    exist_yn: String
    ip: String
}

input DepartmentInput {
    id: ID
    college_cd: String
    dpt_nm: String
    dpt_cd: String
    exist_yn: String
    ip: String
}

input CategoryInput {
    category_type: CategoryType
    category_idx: Int
    category_nm: String
    title: String
    depth: Int
    parent: Int
    access_auth: String
    private_yn: String
    category_icon: String
    desc: String
    ip: String
}

input ImgProfileInput {
    raw: Boolean!           # user_idx 없이 업로드 여부
    user_idx: Int
}

input ImgEditorInput {
    category: String!
}

input ImgGourmetResInput {
    res_idx: Int!
}

input S3UploadInput {
    CATE_ICON: Boolean
    REST_ST_ICON: Boolean
    EDITOR_ATTACHMENTS: ImgEditorInput
    POST_ATTACHMENTS: ImgGourmetResInput
    PROFILE: ImgProfileInput
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
    link: Link
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
    link: Link
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
    childCategories: [BoardCategory]
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

type Report {
    report_idx: ID!
    user: User
    post: Board
    board_idx: Int
    text: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type ResReport {
    report_idx: ID!
    user: User
    resource: RestaurantBoard
    res_idx: Int
    text: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

type Link {
    link_idx: ID!
    name: String
    col_idx: Int
    dpt_idx: Int
    link_url: String
    crawl_type: String
    reg_ip: String
    reg_dt: Date
    upt_ip: String
    upt_dt: Date
}

# Types when objects manipulated
type ModifiedPost {
    result: Boolean!
    data: Board
}

type ModifiedReply {
    result: Boolean!
    data: BoardComment
}

type ModifiedCollege {
    result: Boolean!
    data: College
}

type ModifiedDepartment {
    result: Boolean!
    data: Department
}

type ModifiedCategory {
    result: Boolean!
    data: BoardCategory
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
    me(token: String!): User
    categories(category_type: CategoryType!, depth: Int!): [BoardCategory]
    users: [User]
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
    postsByType(category_type: CategoryType): [Board]
    posts(category_idx: ID): [Board]
    boardById(category_idx: ID): BoardCategory
    boardByType(category_type: CategoryType, title: String): BoardCategory
    comment(cmt_idx: ID!): BoardComment
    schedule: [Schedule]
    notice(code: String!): [Notice]
    reports: [Report]
    resReports: [ResReport]
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
    sendRegisterAuthEmail(user_nm: String!, email: String!, auth_token: String!): Boolean
    authorize(user_idx: Int!, auth_token: String!): Boolean
    lastLogin(user_id: String!, ip: String!): User
    resetEmailToken(email: String!): Boolean
    sendContactMail(name: String!, email: String!, content: String!): Boolean
    # Common
    modPost(mode: ManipulationMode!, options: BoardInput!): ModifiedPost
    modReply(mode: ManipulationMode!, options: ReplyInput!): ModifiedReply
    incrementView(board_idx: Int!): Board
    # Admin
    modCategory(mode: ManipulationMode!, options: CategoryInput!): ModifiedCategory
    modCollege(mode: ManipulationMode!, options: CollegeInput!): ModifiedCollege
    modDepartment(mode: ManipulationMode!, options: DepartmentInput!): ModifiedDepartment
    modReport(user_idx: Int!, board_idx: Int!, text: String!, ip: String!): Report
    modResReport(user_idx: Int!, res_idx: Int!, text: String!, ip: String!): ResReport
    addGourmetPlace(res_nm: String!, category_idx: Int!, user_idx: Int!, res_info: String, res_menu: String, res_phone: String, res_addr: String, res_icon: String, reg_ip: String!, upt_ip: String!): RestaurantBoard
    removeGourmet(res_idx: Int!): Boolean
    # File Uploads
    imageUpload(uploadType: S3UploadType!, file: Upload!, options: S3UploadInput!): String              # Single File upload
    batchImageUpload(uploadType: S3UploadType!, files: [Upload!]!, options: S3UploadInput!): [String]   # Multi Files upload
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
