// Common
import Contact from './common/Contact.graphql'

// 게시물
import modPost from './post/modPost.graphql'
import modReply from './post/modReply.graphql'
import modReport from './post/modReport.graphql'
import modResReport from './post/modResReport.graphql'
import IncrementViewCount from './post/incrementView.graphql'

// 인증
import LoggedInLogger from './auth/LoggedInLogger.graphql'
import Authorize from './auth/Authorize.graphql'
import SendEmailConfirmation from './auth/SendEmailConfirmation.graphql'

// 관리자
import modCategory from './admin/modCategory.graphql'
import addGourmetPlace from './admin/addGourmetPlace.graphql'
import removeGourmet from './admin/removeGourmet.graphql'
import modCollege from './admin/modCollege.graphql'
import modDepartment from './admin/modDepartment.graphql'

// 파일 업로드 트리거
import singleUpload from './upload/singleUpload.graphql'
import multiUpload from './upload/multiUpload.graphql'

export {
  Contact,
  modPost,
  modReply,
  modReport,
  modResReport,
  IncrementViewCount,
  LoggedInLogger,
  Authorize,
  SendEmailConfirmation,
  modCategory,
  addGourmetPlace,
  removeGourmet,
  modCollege,
  modDepartment,
  singleUpload,
  multiUpload
}
