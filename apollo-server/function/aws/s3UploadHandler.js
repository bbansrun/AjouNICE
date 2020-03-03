const AWS = require('aws-sdk');
AWS.config.loadFromPath(`${__dirname}/../../config/aws.json`);
const s3 = new AWS.S3();
const fileExtension = require('file-extension');

// AWS File Upload Handler
const s3DefaultParams = {
  ACL: 'public-read',
  Bucket: 'ajounice',
  Conditions: [
    ['content-length-range', 0, 1024 ** 2 * 20], // Max: 20MB per each
    { acl: 'public-read', }
  ],
};

const handleS3Upload = async (file, bucketDir, key) => {
  const { createReadStream, filename, mimetype, } = await file;
  return new Promise((resolve, reject) => {
    s3.upload({
      ...s3DefaultParams,
      Body: createReadStream(),
      Key: `${bucketDir}/${key}.${fileExtension(filename)}`,
      ContentType: mimetype,
    }, (err, data) => {
      if (err) {
        console.error(`[AWS] ${err}`);
        reject(err);
      } else {
        console.log('[AWS] 성공적으로 데이터 업로드 완료');
        console.log(data);
        resolve(data);
      }
    });
  });
};

module.exports = { handleS3Upload, };
