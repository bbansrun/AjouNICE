import CateInfo from './CateInfo.graphql'
import PostsByCate from './PostsByCate.graphql'
import PostsByKeyword from './PostsSearch.graphql'
import SubCates from './SubCates.graphql'
import Post from './PostDetail.graphql'
import AllCates from './AllCates.graphql'
import AllPosts from './AllPosts.graphql'
import AllUsers from './AllUsers.graphql'
import User from './UserProfile.graphql'
import UserHome from './UserHome.graphql'
import UserModify from './UserModify.graphql'
import BoardsAndPosts from './BoardsAndPosts.graphql'
import Schedule from './Schedule.graphql'
import Notice from './Notice.graphql'
import AdminStatus from './AdminStatus.graphql'
import GourmetCategories from './gourmet/AllCategories.graphql'
import DupIDCheck from './auth/DupIDCheck.graphql'
import DupEmailCheck from './auth/DupEmailCheck.graphql'
import DupNickCheck from './auth/DupNickCheck.graphql'
import Colleges from './auth/Colleges.graphql'
import Departments from './auth/DptByCollege.graphql'
import TokenAuthorization from './auth/TokenAuthorization.graphql'
// Admin
import Codes from './admin/Codes.graphql'
import Users from './admin/Users.graphql'

// Posts
import BoardByType from './posts/BoardByType.graphql'
import PaginationPosts from './posts/PaginatedPosts.graphql'
import PaginationGourmets from './posts/PaginatedGourmets.graphql'

export {
  Post,
  PostsByKeyword,
  CateInfo,
  PostsByCate,
  SubCates,
  AllCates,
  AllPosts,
  AllUsers,
  BoardsAndPosts,
  User,
  UserHome,
  UserModify,
  Schedule,
  Notice,
  AdminStatus,
  GourmetCategories,
  DupIDCheck,
  DupEmailCheck,
  DupNickCheck,
  Colleges,
  Departments,
  TokenAuthorization,
  Codes,
  Users,
  BoardByType,
  PaginationPosts,
  PaginationGourmets
}
