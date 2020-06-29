const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const pythonServices = require('../services/pythonServices')
const authorize = require("../middleware/authorize");

router.post("/", multipartMiddleware, async (req, res, next) => {
  try {
    let response = await pythonServices.processDataFromPython(req.body, req.files)
    return res.send(response)
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

module.exports = router;
