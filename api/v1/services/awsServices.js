const aws = require("aws-sdk");
const config = require("../../../config");
const fs = require("fs");
const common = require('../../common')
const responseStatus = require('../../../configs/responseStatus')

let s3bucket = new aws.S3({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.SECRETT_KEY,
  Bucket: config.AWS.BUCKET_NAME,
});

async function uploadImageToS3(folderName, file) {
  let data = fs.createReadStream(file.path);
  let fileName = common.formatDate(Date.now())
  fileName = fileName.replace(/\/|:/g, '-');
  var params = {
    Bucket: config.AWS.BUCKET_NAME,
    Key: folderName + '/' + fileName,
    Body: data,
    ACL: "public-read",
    ContentType: "image/png",
  };
  const s3Response = await s3bucket.upload(params).promise()
  // console.log(s3Response)
  return s3Response.Location
}

module.exports = {
  uploadImageToS3,
};
