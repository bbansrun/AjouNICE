// Common
import College from './common/College.graphql'
import AllColleges from './common/Colleges.graphql'
import Department from './common/Department.graphql'
import PostsByCate from './common/PostsByCate.graphql'
import CateById from './common/CateById.graphql'

// 정리 필요
import CateInfo from './CateInfo.graphql'
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
import DupIDCheck from './auth/DupIDCheck.graphql'
import DupEmailCheck from './auth/DupEmailCheck.graphql'
import DupNickCheck from './auth/DupNickCheck.graphql'
import Colleges from './auth/Colleges.graphql'
import Departments from './auth/DptByCollege.graphql'
import TokenAuthorization from './auth/TokenAuthorization.graphql'
// Admin
import GourmetListByCate from './admin/listGourmetById.graphql'
import Codes from './admin/Codes.graphql'
import Users from './admin/Users.graphql'

// Posts
import BoardByType from './posts/BoardByType.graphql'
import PaginationPosts from './posts/PaginatedPosts.graphql'
import PaginationGourmets from './posts/PaginatedGourmets.graphql'

// Gourmet
import GourmetCategories from './gourmet/AllCategories.graphql'
import GourmetById from './gourmet/GourmetById.graphql'

export {
  CateById,
  College,
  AllColleges,
  Department,
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
  DupIDCheck,
  DupEmailCheck,
  DupNickCheck,
  Colleges,
  Departments,
  TokenAuthorization,
  GourmetListByCate,
  Codes,
  Users,
  BoardByType,
  PaginationPosts,
  PaginationGourmets,
  GourmetById,
  GourmetCategories
}
