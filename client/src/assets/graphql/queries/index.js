// Common
// -- 공지사항
import ServiceNotice from './common/ServiceNotice.graphql'
import Notice from './common/Notice.graphql'
// -- 학부 / 학과
import College from './common/College.graphql'
import AllColleges from './common/Colleges.graphql'
import Department from './common/Department.graphql'
import Departments from './common/DptByCollege.graphql'
// -- 학사일정
import Schedule from './common/Schedule.graphql'

// 유저 프로필
import Profile from './profile/Profile.graphql'

// 인증
import DupIDCheck from './auth/DupIDCheck.graphql'
import DupEmailCheck from './auth/DupEmailCheck.graphql'
import DupNickCheck from './auth/DupNickCheck.graphql'
import TokenAuthorization from './auth/TokenAuthorization.graphql'
import SendEmailConfirmation from './auth/SendEmailConfirmation.graphql'

// 관리자
import AdminStatus from './admin/AdminStatus.graphql'
import GourmetListByCate from './admin/listGourmetById.graphql'
import Codes from './admin/Codes.graphql'
import Users from './admin/Users.graphql'
import Reports from './admin/Reports.graphql'

// 게시물
import Post from './posts/PostDetail.graphql'
import BriefPost from './posts/BriefPost.graphql'
import Categories from './posts/Categories.graphql'
import PostsByCate from './posts/PostsByCate.graphql'
import CateInfo from './posts/CateInfo.graphql'
import AllCates from './posts/AllCates.graphql'
import CateById from './posts/CateById.graphql'
import SubCates from './posts/SubCates.graphql'
import BoardByType from './posts/BoardByType.graphql'
import PaginationPosts from './posts/PaginatedPosts.graphql'
import PaginationGourmets from './posts/gourmet/PaginatedGourmets.graphql'
import PostsByKeyword from './posts/Search.graphql'
// -- 맛집
import GourmetCategories from './posts/gourmet/AllCategories.graphql'
import GourmetById from './posts/gourmet/GourmetById.graphql'

export {
  Profile,
  CateById,
  College,
  AllColleges,
  Department,
  Post,
  BriefPost,
  Categories,
  PostsByKeyword,
  CateInfo,
  PostsByCate,
  SubCates,
  AllCates,
  Schedule,
  Notice,
  ServiceNotice,
  AdminStatus,
  DupIDCheck,
  DupEmailCheck,
  DupNickCheck,
  SendEmailConfirmation,
  Departments,
  TokenAuthorization,
  GourmetListByCate,
  Codes,
  Users,
  Reports,
  BoardByType,
  PaginationPosts,
  PaginationGourmets,
  GourmetById,
  GourmetCategories
}
