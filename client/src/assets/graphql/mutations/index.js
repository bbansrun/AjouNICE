import writePost from './post/writePost.graphql'
import writeReply from './post/writeReply.graphql'
import removeReply from './post/removeReply.graphql'
import editReply from './post/editReply.graphql'
import editPost from './post/editPost.graphql'
import removePost from './post/removePost.graphql'
import IncrementViewCount from './post/postViewed.graphql'

import LoggedInLogger from './auth/LoggedInLogger.graphql'
import Authorize from './auth/Authorize.graphql'
import UploadedProfileImageURL from './auth/UploadedProfileImageURL.graphql'
import ModifiedProfileImageURL from './auth/ModifiedProfileImageURL.graphql'

import UploadedCategoryIcon from './admin/UploadedCategoryIcon.graphql'
import addCategory from './admin/addCategory.graphql'
import removeCategory from './admin/removeCategory.graphql'
import addGourmetPlace from './admin/addGourmetPlace.graphql'
import addGourmetResIcon from './admin/addGourmetResIcon.graphql'
import addGourmetResources from './admin/addGourmetResources.graphql'
import removeGourmet from './admin/removeGourmet.graphql'
import modCollege from './admin/modCollege.graphql'
import modDepartment from './admin/modDepartment.graphql'
import createCollege from './admin/createCollege.graphql'
import createDepartment from './admin/createDepartment.graphql'

import singleUpload from './upload/singleUpload.graphql'
import multiUpload from './upload/multiUpload.graphql'

export {
  writeReply,
  removeReply,
  editReply,
  writePost,
  editPost,
  removePost,
  IncrementViewCount,
  LoggedInLogger,
  Authorize,
  UploadedProfileImageURL,
  ModifiedProfileImageURL,
  UploadedCategoryIcon,
  addCategory,
  removeCategory,
  addGourmetPlace,
  addGourmetResIcon,
  addGourmetResources,
  removeGourmet,
  modCollege,
  modDepartment,
  createCollege,
  createDepartment,
  singleUpload,
  multiUpload
}
