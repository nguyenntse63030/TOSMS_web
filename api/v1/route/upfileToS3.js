const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const awsServices = require("../services/awsServices");
const authorize = require("../middleware/authorize");

router.post("/", authorize(), multipartMiddleware, async (req, res, next) => {
  try {
    let response = await awsServices.uploadImageToS3(req.files.image);
    console.log(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

module.exports = router;
