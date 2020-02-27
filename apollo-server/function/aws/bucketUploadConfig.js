const uuid = require('uuid/v4');
const defaultFilename = `${uuid()}_${Date.now().valueOf()}`;
module.exports = {
  userProfile: () => ({
    key: 'user/profile',
    filename: defaultFilename,
  }),
  postImage: (cateTitle) => ({
    key: `board/${cateTitle}`,
    filename: defaultFilename,
  }),
  gourmetIcon: () => ({
    key: 'restaurant/icon',
    filename: defaultFilename,
  }),
  gourmetImage: (res_idx) => ({
    key: 'restaurant/res_img',
    filename: `res_${res_idx}_${defaultFilename}`,
  }),
}
;
