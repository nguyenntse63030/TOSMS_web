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

async function uploadImageToS3(file) {
  let data = fs.createReadStream(file.path);
  let fileName = common.formatDate(Date.now())
  fileName = fileName.replace(/\/|:/g, '-');
  var params = {
    Bucket: config.AWS.BUCKET_NAME,
    Key: "Imagetree/" + fileName,
    Body: data,
    ACL: "public-read",
    ContentType: "image/png",
  };
  s3bucket.upload(params, function (err, data) {
    if (err) {
      console.log("error in callback");
      console.log(err);
      return responseStatus.Code400({errorMessage: responseStatus.UPLOAD_IMAGE_FAIL})
    }
    console.log("success");
    console.log(data);
    return responseStatus.Code200({message: responseStatus.UPLOAD_IMAGE_SUCCESSFULLY})
  });
}

module.exports = {
  uploadImageToS3,
};
