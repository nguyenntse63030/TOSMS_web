const express = require("express");
const router = express.Router();
const treeDetectLocationServices = require("../services/treeDetectLocationServices");
const authorize = require("../middleware/authorize");
const constants = require('../../../configs/constant')

router.get("/", async (req, res, next) => {
  try {
    let response = await treeDetectLocationServices.getAllTreeDetectLocation();
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/:cameraID", async (req, res, next) => {
  try {
    let response = await treeDetectLocationServices.getByCameraID(req.params.cameraID);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

module.exports = router;
