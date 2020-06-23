const aws = require("aws-sdk");
const config = require("../../../config");
const fs = require("fs");

let s3bucket = new aws.S3({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.SECRETT_KEY,
  Bucket: config.AWS.BUCKET_NAME,
});

async function uploadImageToS3(file) {
  //   let data = fs.readFileSync(file.path);
  let data = fs.createReadStream(file.path);
  var params = {
    Bucket: config.AWS.BUCKET_NAME,
    Key: "Imagetree/" + file.name,
    Body: data,
    ACL: "public-read",
    ContentType: "image/png",
  };
  s3bucket.upload(params, function (err, data) {
    if (err) {
      console.log("error in callback");
      console.log(err);
      return;
    }
    console.log("success");
    console.log(data);
  });
}

module.exports = {
  uploadImageToS3,
};
