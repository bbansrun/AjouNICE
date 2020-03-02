const uuid = require('uuid/v4');
const defaultFilename = `${uuid()}_${Date.now().valueOf()}`;

exports.PROFILE = (user_idx = null) => ({
  key: 'user/profile',
  filename: user_idx ? `profile_${user_idx}_${defaultFilename}` : defaultFilename,
});

exports.EDITOR_ATTACHMENTS = (cateTitle) => ({
  key: `board/${cateTitle}`,
  filename: defaultFilename,
});

exports.CATE_ICON = () => ({
  key: 'board/cateIcons',
  filename: defaultFilename,
});

exports.REST_ST_ICON = () => ({
  key: 'restaurant/icons',
  filename: defaultFilename,
});

exports.POST_ATTACHMENTS = (res_idx) => ({
  key: 'restaurant/resources',
  filename: `res_${res_idx}_${defaultFilename}`,
});
