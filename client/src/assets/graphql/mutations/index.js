import writePost from './writePost.graphql'
import writeReply from './writeReply.graphql'
import removeReply from './removeReply.graphql'
import editReply from './editReply.graphql'
import editPost from './editPost.graphql'
import removePost from './removePost.graphql'
import UploadFiles from './UploadFiles.graphql'
import IncrementViewCount from './postViewed.graphql'
import singleUpload from './singleUpload.graphql'

import LoggedInLogger from './auth/LoggedInLogger.graphql'
import Authorize from './auth/Authorize.graphql'
import UploadedProfileImageURL from './auth/UploadedProfileImageURL.graphql'
import ModifiedProfileImageURL from './auth/ModifiedProfileImageURL.graphql'

export {
  writeReply,
  removeReply,
  editReply,
  writePost,
  editPost,
  removePost,
  UploadFiles,
  IncrementViewCount,
  singleUpload,
  LoggedInLogger,
  Authorize,
  UploadedProfileImageURL,
  ModifiedProfileImageURL
}
