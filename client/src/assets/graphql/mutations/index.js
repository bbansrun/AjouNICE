import writePost from './writePost.graphql'
import writeReply from './writeReply.graphql'
import removeReply from './removeReply.graphql'
import editPost from './editPost.graphql'
import removePost from './removePost.graphql'
import UploadFiles from './UploadFiles.graphql'
import IncrementViewCount from './postViewed.graphql'
import singleUpload from './singleUpload.graphql'

import LoggedInLogger from './auth/LoggedInLogger.graphql'
import Authorize from './auth/Authorize.graphql'

export {
  writePost,
  writeReply,
  removeReply,
  editPost,
  removePost,
  UploadFiles,
  IncrementViewCount,
  singleUpload,
  LoggedInLogger,
  Authorize
}
